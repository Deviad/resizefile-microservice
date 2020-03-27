import {Application, Request, Response} from 'express';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';
import {ApiError} from '../error/Error';
import {resizeImage} from '../services/resizeServices';
import {saveIntoFolder} from '../services/fileServices';
import {ImageControllerHandler} from '../services/ImageControllerHandler';
import {wrapAsync} from '../services/asyncWrapper';
import CacheProvider from '../services/CacheProvider';


interface IExtendedRequest extends Request {
  busboy: busboy.Busboy;
}

class ImageController {

  private readonly app: Application;
  private readonly db: TypeORMCLient<Image>;

  constructor(app: Application, db: TypeORMCLient<Image>) {
    this.app = app;
    this.db = db;
  }

  public async get(...args: any[]) {
    throw new Error('Method not implemented.');
  }

  public async save(endpoint: string): Promise<any> {
    return this.app.route(endpoint).post(wrapAsync(async (req: IExtendedRequest, res: Response) => {
      try {

        await saveIntoFolder(res, req);
        await ImageControllerHandler.createNewDbEntry(this.db, req.query.name);
        const cache = CacheProvider.getCache();
        cache.set(req.query.name, true);
        res.status(201).json({'status': 'success'});
      } catch (error) {
        const code = error.statusCode || 500;
        throw new ApiError(code, error);
      }
    }));
  }

  public async resize(endpoint: string): Promise<any> {
    return this.app.route(endpoint).get(wrapAsync(async (req: Request, res: Response) => {
      try {
        await resizeImage(req);
        await ImageControllerHandler.createNewDbEntry(this.db, req.query.name + req.query.size);
        const cache = CacheProvider.getCache();
        cache.set(req.query.name + req.query.size, true);
        res.status(201).json({'status': 'success'});
      } catch (error) {
        const code = error.statusCode || 500;
        throw new ApiError(code, error);
      }
    }));
  }
}

export default ImageController;
