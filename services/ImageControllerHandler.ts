import {Image} from '../model';

export class ImageControllerHandler {
  public static async createNewDbEntry(db:any, name: string) {
    const image = new Image();
    image.timestamp = new Date(Date.now()).toISOString();
    image.name = name;
    await db.em.save(image);
  }
}
