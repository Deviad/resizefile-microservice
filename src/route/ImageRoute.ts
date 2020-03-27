import ImageController from '../controller/ImageController';
import {Application} from 'express';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';

export default function (app: Application, db: TypeORMCLient<Image>): any {

  const expertController = new ImageController(app, db);

  return [
    expertController.save('/image').then(item => item),
    expertController.resize('/image/resize').then(item => item),
  ];
}
