import * as path from 'path';
import * as fs from 'fs';

export const getCurrentExtension = (fileName: string) => {
  let currentExtension;
  const fileExtensions = ['jpg', 'jpeg', 'png'];
  fileExtensions.forEach(x => {
    if (fileName.endsWith(x)) {
      currentExtension = x;
    }
  });
  if (currentExtension) {
    return currentExtension;
  }
  throw new Error('Wrong image format');
};
export const saveIntoFolder = (res, req) => new Promise((resolve, reject) => {
  let fstream;
  try {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log('Uploading: ' + filename);
      let imagePath = path.resolve(__dirname, '../public/imagestock/', filename);
      fstream = fs.createWriteStream(imagePath);
      file.pipe(fstream);
      fstream.on('close', function () {
        resolve();
      });
    });
  } catch (err) {
    reject();
  }
});
