import ImageController from '../controller/ImageController';
import {Application} from 'express';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';

export default function (app: Application, db: TypeORMCLient<Image>, cache: Map<string, boolean>): any {

  const expertController = new ImageController(app, db, cache);

  return [
    expertController.save('/image').then(item => item),
    expertController.resize('/image/resize').then(item => item),
    // expertController.apiIndex('/experts').then(item => item),
    // expertController.getExpert('/experts/:expertID').then(item => item),
    // expertController.typeForm('/experts/typeform').then(item => item),
    // expertController.testRoute('/experts/testRoute').then(item => item)
  ];
}
