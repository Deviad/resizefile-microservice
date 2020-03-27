import {createConnection,  Connection } from 'typeorm';
import config from '../../config';

const {db_name, db_host, db_user, db_pass, db_type, db_port, db_logging } = config.database;

const configurationObject: any = {
  authSource: 'admin',
  cli: {
    'migrationsDir': 'migrations'
  },
  entities: [
    `${__dirname}/../../model/*.ts`
  ],
  logging: db_logging,
  migrations: [`${__dirname}/../../migration/*.ts`],
  migrationsTableName: 'migrations',
  type: 'mongodb',
  url: `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`,
  useNewUrlParser: true,
};

export class TypeORMConnection {
  private static isConnected: boolean = false;
  private static db: Connection;
  public static getConnection(result: (connection) => void) {
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect((db: Connection) => {
        return result(this.db);
      });
    }
  }

  private static async connect(result: (db: Connection) => void) {
    try {
      this.db = await createConnection(configurationObject);
      this.isConnected = true;
      return result(this.db);
    } catch (error) {
      console.error(error);
    }
    }
}
