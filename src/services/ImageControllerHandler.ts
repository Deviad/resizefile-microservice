import {Image} from '../model';

export class ImageControllerHandler {
  public static async createNewDbEntry(db: any, name: string) {
    const image = this.createImageEntity(name);
    await db.em.save(image);
  }

  private static createImageEntity(name: string) {
    const image = new Image();
    image.timestamp = new Date(Date.now()).toISOString();
    image.name = name;
    return image;
  }
}
