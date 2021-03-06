import 'reflect-metadata';
import {BaseEntity, Column, Entity, ObjectIdColumn} from 'typeorm';
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
    const imageEntity = new Image();
    imageEntity.timestamp = image.timestamp;
    imageEntity.name = image.name;
    return imageEntity;
  }
}





