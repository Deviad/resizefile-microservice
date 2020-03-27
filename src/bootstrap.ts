import * as express from 'express';
import {Express} from 'express';
import * as path from 'path';
import * as busboy from 'connect-busboy';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import config from './config';
import ImageRoute from './route/ImageRoute';
import {TypeORMCLient} from './utils/sqldb/client';
import {Image} from './model';
import {MongoClient} from 'mongodb';
import * as methodOverride from 'method-override';
import {cacheErrorHandler} from './services/cacheErrorHandler';
import CacheProvider from './services/CacheProvider';
import {errorHandler} from './services/errorHandler';

const {server: {port}} = config;
const {db_host, db_user, db_pass, db_port, db_name} = config.database;
let app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
CacheProvider.getCache();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(busboy());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(cacheErrorHandler);
app.use(errorHandler);


(async () => {
  const url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
  const connection = await MongoClient.connect(url, {authSource: 'admin'});
  let dbList = await connection.db().executeDbAdminCommand({listDatabases: 1});
  if (!(dbList.databases as Array<any>).find(x => x.name === db_name)) {
    await connection.db(db_name).createCollection('images');
    await connection.db().admin().command({
      createUser: db_user,
      pw: db_pass,
      roles: [
        {role: 'root', db: 'ownzones'}
      ],
    });
  } else {
    const results = await connection.db(db_name).collection('images').find().toArray();
    let cache = CacheProvider.getCache();
    results.forEach(x => cache.set(x.name, true));

  }

  await connection.close();
  const imageRepo = new TypeORMCLient<Image>(Image);
  for (let routeHandler of ImageRoute(app, imageRepo)) {
    await routeHandler;
  }
})();

app.listen(port);
console.log(`Server started on port ${port} :)`);

export default app;
