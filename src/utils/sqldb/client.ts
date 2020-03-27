import {Connection, EntityManager} from 'typeorm';
import {TypeORMConnection} from './connection';
import {IGenericEntity} from '../../model';

export class TypeORMCLient<T> {
  public db: Connection;
  public em: EntityManager;

  constructor(public collection: { new(...args: any[]): IGenericEntity<T>; }) {
    TypeORMConnection.getConnection((connection) => {
      this.db = connection;
      this.em = this.db.manager;
    });
  }

  public find(collection?: IGenericEntity<any>, options?: object): Promise<void | IGenericEntity<T>[]> {
    return new Promise<void | IGenericEntity<T>[]>((resolve, reject) => {
      try {
        collection = collection || this.collection as IGenericEntity<any>;
        resolve(this.em.find(this.collection, options));
      } catch (err) {
        console.log(err);
      }
    });
  }

  public findOneOrFail(objectId: number): Promise<void | IGenericEntity<T>> {
    return new Promise<void | IGenericEntity<T>>((resolve, reject) => {
      try {
        resolve(this.em.findOneOrFail(this.collection, objectId));
      } catch (err) {
        console.log(err);
      }
    });
  }

  public findOneByOrFail(object: object): Promise<void | IGenericEntity<T>> {
    return new Promise<void | IGenericEntity<T>>((resolve, reject) => {
      try {
        resolve(this.em.findOneOrFail(this.collection, object));
      } catch (err) {
        console.log(err);
      }
    });
  }

  public save(model: IGenericEntity<T>, collection?: IGenericEntity<any>): Promise<void | IGenericEntity<T>> {
    const entity = new this.collection();
    return new Promise<IGenericEntity<T>>((resolve, reject) => {
      try {
        let data: any;
        data = collection || entity.create(model);
        resolve(this.em.save(data));
      } catch (err) {
        console.log(err);
      }
    });
  }

  public update(objectID: number, partial: Object, collection?: IGenericEntity<any>): Promise<void | IGenericEntity<T>> {
    return new Promise<any>((resolve, reject) => {
      try {
        collection = collection || this.collection as IGenericEntity<any>;
        resolve(this.em.update(collection as any, objectID, partial));
      } catch (err) {
        console.log(err);
      }
    });
  }

  public remove(model: IGenericEntity<T>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        resolve(this.em.remove(this.collection, model));
      } catch (err) {
        console.log(err);
      }
    });
  }

  public getCollection() {
    return this.collection;
  }

  //
  // private result(err, res: any, resolve, reject ): any {
  //   if (err) {
  //       reject(err);
  //   }
  //    resolve(res);
  // }
}
