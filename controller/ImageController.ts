import {Application, Request, Response} from 'express';
import config from '../config';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';
import {ApiError, wrapAsync} from '../error/Error';
import * as fs from 'fs';

import * as sharp from 'sharp';
import * as path from 'path';

const {server: {port}, databaseURL, domain} = config;


interface IExtendedRequest extends Request {
  busboy: busboy.Busboy;
}

class ImageController {

  private _app: Application;
  private _db: TypeORMCLient<Image>;
  private _cache: Map<string, boolean>;

  private static saveIntoFolder = (res, req) => new Promise((resolve, reject) => {
    let fstream;
    try {
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        console.log('Uploading: ' + filename);
        let imagePath = path.resolve(__dirname, '../public/imagestock/', filename);
        fstream = fs.createWriteStream(imagePath);
        file.pipe(fstream);
        fstream.on('close', function () {
          resolve();
        });
      });
    } catch (err) {
      reject();
    }
  });

  private static calculateSize(sizes: string[]) {
    const width = parseInt(sizes[0], 10);
    const height = parseInt(sizes[1], 10);
    return {width, height};
  }

  private static getCurrentExtension = (fileName: string) => {
    let currentExtension;
    const fileExtensions = ['jpg', 'jpeg', 'png'];
    fileExtensions.forEach(x => {
      if (fileName.endsWith(x)) {
        currentExtension = x;
      }
    });
    return currentExtension;
  };

  private static async resizeImage(req: Request) {
    let imagePath = path.resolve(__dirname, '../public/imagestock/', req.query.name);
    const sizes = req.query.size.split('x');
    const {width, height} = ImageController.calculateSize(sizes);
    const file = fs.readFileSync(imagePath);
    const currentEtension = ImageController.getCurrentExtension(req.query.name);
    const tPath = imagePath.split('.' + currentEtension)[0];
    await sharp(file).resize(width, height).toFile(tPath + req.query.size + '.' + currentEtension);
  }

  constructor(app: Application, db: TypeORMCLient<Image>, cache: Map<string, boolean>) {
    this._app = app;
    this._db = db;
    this._cache = cache;
  }

  public async get(...args: any[]) {
    throw new Error('Method not implemented.');
  }

  public async save(endpoint: string): Promise<any> {
    return this._app.route(endpoint).post(wrapAsync(async (req: IExtendedRequest, res: Response) => {
      try {

        if (this._cache.get(req.query.name)) {
          throw new ApiError(400, 'An image with this name already exists');
        }

        await ImageController.saveIntoFolder(res, req);
        await this.createNewDbEntry(req.query.name);
        this._cache.set(req.query.name, true);
        res.status(201).json({'status': 'success'});
      } catch (error) {
        throw new ApiError(500, error);
      }
    }));
  }

  public async resize(endpoint: string): Promise<any> {
    return this._app.route(endpoint).get(wrapAsync(async (req: Request, res: Response) => {
      try {
        if (this._cache.get(req.query.name + req.query.size)) {
          throw new ApiError(400, 'An image with this name and resolution already exists');
        }

        if (!this._cache.get(req.query.name)) {
          throw new ApiError(400, 'Cannot resize an image which has not been uploaded');
        }

        await ImageController.resizeImage(req);
        this.createNewDbEntry(req.query.name + req.query.size);
        this._cache.set(req.query.name + req.query.size, true);
        res.status(201).json({'status': 'success'});
      } catch (error) {
        throw new ApiError(500, error);
      }
    }));
  }

  private async createNewDbEntry(name: string) {
    const image = new Image();
    image.timestamp = new Date(Date.now()).toISOString();
    image.name = name;
    await this._db.em.save(image);
  }
}

export default ImageController;
