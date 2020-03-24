import ExpertController from '../controller/ExpertController';
import {Application} from 'express';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';

export default function (app: Application, db: TypeORMCLient<Image>): any {
  const expertController = new ExpertController(app, db);

  return [
    expertController.save('/image').then(item => item),
    // expertController.apiIndex('/experts').then(item => item),
    // expertController.getExpert('/experts/:expertID').then(item => item),
    // expertController.typeForm('/experts/typeform').then(item => item),
    // expertController.testRoute('/experts/testRoute').then(item => item)
  ];
}
