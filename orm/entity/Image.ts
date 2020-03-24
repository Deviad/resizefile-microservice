import {Entity, PrimaryGeneratedColumn, Column, Index, OneToMany} from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: 'varchar', length: '100', nullable: false})
  @Index({unique: true})
  public name: string;

  @Column({type: 'datetime', nullable: false})
  public timestamp: string;
}
