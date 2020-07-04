import {Request} from 'express';
import * as path from 'path';
import {promises as fsPromises} from 'fs';

import * as sharp from 'sharp';
import {getCurrentExtension} from './fileServices';

export const calculateSize = (sizes: string[]) => {
  const width = parseInt(sizes[0], 10);
  const height = parseInt(sizes[1], 10);
  return {width, height};
};

export const resizeImage = async (req: Request) => {
  let imagePath = path.resolve(__dirname, '../public/imagestock/', req.query.name);
  const sizes = req.query.size.split('x');
  const {width, height} = calculateSize(sizes);
  const file = await fsPromises.readFile(imagePath);
  const currentExtension = getCurrentExtension(req.query.name);
  const tPath = imagePath.split('.' + currentExtension)[0];
  await sharp(file).resize(width, height).toFile(tPath + req.query.size + '.' + currentExtension);
};
