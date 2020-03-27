import {NextFunction, Request} from 'express';
import CacheProvider from './CacheProvider';
import {ApiError} from '../error/Error';

export function addErrorForExistingNameAndResolution(next: NextFunction, req: Request) {
  if (CacheProvider.getCache().get(req.query.name + req.query.size)) {
    next(new ApiError(400, 'An image with this name and resolution already exists'));
  }
}

export function addImageNotUploadedError(req: Request, next: NextFunction) {
  if (!CacheProvider.getCache().get(req.query.name)) {
    next(new ApiError(400, 'Cannot resize an image which has not been uploaded'));
  }
}

export function addImageWithSameNameExistingError(req: Request, next: NextFunction) {
  if (CacheProvider.getCache().get(req.query.name)) {
    next(new ApiError(400, 'An image with this name already exists'));
  }
}
