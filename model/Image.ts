import 'reflect-metadata';
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, OneToMany, ObjectIdColumn} from 'typeorm';
import {IGenericEntity} from './IGenericEntity';

export interface IImage extends IGenericEntity<IImage> {
  timestamp: string;
  id?: number;
  name?: string;
  create?: (user: Image) => IImage;

}

@Entity('images')
export class Image extends BaseEntity implements IImage {

  @ObjectIdColumn()
  public id: number;


  @Column({type: 'datetime', nullable: false})
  public timestamp: string;

  @Column({type: 'varchar', length: '100', nullable: false})
  public name: string;

  constructor() {
    super();
  }

  public create(image: IImage) {
    const _image = new Image();
    _image.timestamp = image.timestamp;
    _image.name = image.name;
    return _image;
  }
}





