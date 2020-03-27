import {NextFunction, Request, Response} from 'express';
import {ApiError} from '../error/Error';
import {CacheProvider} from './CacheProvider';

export function cacheErrorHandler(req: Request, res: Response, next: NextFunction) {
  if ((req.originalUrl as string).includes('/image/resize')) {
    if (CacheProvider.getCache().get(req.query.name + req.query.size)) {
      next(new ApiError(400, 'An image with this name and resolution already exists'));
    }
    if (!CacheProvider.getCache().get(req.query.name)) {
      next(new ApiError(400, 'Cannot resize an image which has not been uploaded'));
    }
    next();
  } else if ((req.originalUrl as string).includes('/image')) {
    if (CacheProvider.getCache().get(req.query.name)) {
      next(new ApiError(400, 'An image with this name already exists'));
    }
    next();
  } else {
    next();
  }
}

