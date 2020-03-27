import {NextFunction, Request, Response} from 'express';
import {addErrorForExistingNameAndResolution, addImageNotUploadedError, addImageWithSameNameExistingError} from './errorHandlingFunctions';

export function cacheErrorHandler(req: Request, res: Response, next: NextFunction) {

  if ((req.originalUrl as string).includes('/image/resize')) {
    addErrorForExistingNameAndResolution(next, req);
    addImageNotUploadedError(req, next);
    next();
  } else if ((req.originalUrl as string).includes('/image')) {
    addImageWithSameNameExistingError(req, next);
    next();
  } else {
    next();
  }
}

