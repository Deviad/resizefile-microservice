import {NextFunction, Request} from 'express';
import {ApiError} from '../error/Error';

export function addErrorForExistingNameAndResolution(req: Request, next: NextFunction) {
  next(new ApiError(400, 'An image with this name and resolution already exists'));
}

export function addImageNotUploadedError(req: Request, next: NextFunction) {
  next(new ApiError(400, 'Cannot resize an image which has not been uploaded'));
}

export function addImageWithSameNameExistingError(req: Request, next: NextFunction) {
  next(new ApiError(400, 'An image with this name already exists'));
}
