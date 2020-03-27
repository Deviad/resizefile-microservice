import {NextFunction, Request, Response} from 'express';
import {ApiError} from '../error/Error';
import CacheProvider from './CacheProvider';

export function addErrorForExistingNameAndResolution(next: NextFunction, req: Request) {
  if (CacheProvider.getCache().get(req.query.name + req.query.size)) {
    next(new ApiError(400, 'An image with this name and resolution already exists'));
  }
}

function addImageNotUploadedError(req: Request, next: NextFunction) {
  if (!CacheProvider.getCache().get(req.query.name)) {
    next(new ApiError(400, 'Cannot resize an image which has not been uploaded'));
  }
}

function addImageWithSameNameExistingError(req: Request, next: NextFunction) {
  if (CacheProvider.getCache().get(req.query.name)) {
    next(new ApiError(400, 'An image with this name already exists'));
  }
}

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

