import * as express from 'express';
import * as path from 'path';
import * as busboy from 'connect-busboy';
import {Express} from 'express';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import config from './config';
import ImageRoute from './route/ImageRoute';
import {TypeORMCLient} from './utils/sqldb/client';
import {Image} from './model';
import {MongoClient} from 'mongodb';
import {handleError} from './error/Error';
import * as methodOverride from 'method-override';
const {server: {port}} = config;
const {db_host, db_user, db_pass, db_port, db_name} = config.database;
let app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(busboy());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

const cache = new Map<string, boolean>();

(async () => {
  const url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
  const connection = await MongoClient.connect(url, {authSource: 'admin'});
  let dbList = await connection.db().executeDbAdminCommand({listDatabases: 1});
  if (!(dbList.databases as Array<any>).find(x => x.name === db_name)) {
    await connection.db(db_name).createCollection('images');
    await connection.db().admin().command({
      updateUser: db_user,
      // tslint:disable-next-line:object-literal-sort-keys
      roles: [
        {role: 'root', db: 'ownzones'}
      ],
    });
  }

  await connection.close();
  const imageRepo = new TypeORMCLient<Image>(Image);
  for (let routeHandler of ImageRoute(app, imageRepo, cache)) {
    await routeHandler;
  }
})();

app.listen(port);
console.log(`Server started on port ${port} :)`);

export default app;
