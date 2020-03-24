import 'reflect-metadata';
import {createConnection} from 'typeorm';
import {Image} from './entity/Image';
createConnection().then(async connection => {

    console.log('Inserting a new user into the database...');

    await connection.manager.find(Image);
    await connection.close();
    console.log('Goodbye!');
}).catch(error => console.log(error));
