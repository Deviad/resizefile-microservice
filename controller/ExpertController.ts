import {Application, Request, Response} from 'express';
import config from '../config';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';
import {ApiError} from '../error/Error';
import * as fs from 'fs';

import sharp from 'sharp';
import {ConnectBusboyOptions} from 'connect-busboy';
import * as path from 'path';
const {server: {port}, databaseURL, domain} = config;


interface IExtendedRequest extends Request {
  busboy: busboy.Busboy;
}

class ExpertController {

  private _app: Application;
  private _db: TypeORMCLient<Image>;
  private _cache: Map<string, boolean>;

  private static saveOperation =  (res, req) => new Promise((resolve, reject) => {
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
  })

  constructor(app: Application, db: TypeORMCLient<Image>, cache: Map<string, boolean>) {
    this._app = app;
    this._db = db;
    this._cache = cache;
  }

  public async get(...args: any[]) {
    throw new Error('Method not implemented.');
  }

  public async save(endpoint: string): Promise<any> {
    return this._app.route(endpoint).post(async (req: IExtendedRequest, res: Response) => {
      try {

        if (this._cache.get(req.query.name)) {
          res.status(201).json(
            {
              'message': 'An image with this name already exists',
              'status': 'error',
            });
        }

        await ExpertController.saveOperation(res, req);

        const image = new Image();
        image.timestamp = new Date(Date.now()).toISOString();
        image.name = req.query.name;
        await this._db.em.save(image);

        this._cache.set(req.query.name, true);

        res.status(201).json({'status': 'success'});
      } catch (error) {
        throw new ApiError(500, error);
      }
    });
  }


  public async resize(endpoint: string): Promise<any> {
    return this._app.route(endpoint).get(async (req: Request, res: Response) => {
      try {
        if (this._cache.get(req.query.name + req.query.size)) {
          res.status(201).json(
            {
              'message': 'An image with this name and resolution already exists',
              'status': 'error',
            });
        }

        if (!this._cache.get(req.query.name)) {
          res.status(201).json(
            {
              'message': 'Cannot resize an image which has not been uploaded',
              'status': 'error',
            });
        }

        const image = new Image();
        image.timestamp = new Date(Date.now()).toISOString();
        image.name = req.query.name + req.query.size;
        await this._db.em.save(image);

        this._cache.set(req.query.name + req.query.size, true);

        res.status(201).json({'status': 'success'});
      } catch (error) {
        throw new ApiError(500, error);
      }
    });
  }


}

export default ExpertController;
