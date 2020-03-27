import {NextFunction, Request, Response} from 'express';
import {addErrorForExistingNameAndResolution, addImageNotUploadedError, addImageWithSameNameExistingError} from './errorHandlingFunctions';
import CacheProvider from './CacheProvider';

export function cacheErrorHandler(req: Request, res: Response, next: NextFunction) {
  if ((req.originalUrl as string).includes('/image/resize')) {
    if (CacheProvider.getCache().get(req.query.name + req.query.size)) {
      addErrorForExistingNameAndResolution(req, next);
    } else if (!CacheProvider.getCache().get(req.query.name)) {
      addImageNotUploadedError(req, next);
    } else {
      next();
    }
  } else if ((req.originalUrl as string).includes('/image')) {
    if (CacheProvider.getCache().get(req.query.name)) {
      addImageWithSameNameExistingError(req, next);
    } else {
      next();
    }
  } else {
    next();
  }
}

