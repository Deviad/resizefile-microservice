import {NextFunction, Request, Response} from 'express';


export function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

export class ApiError extends Error {
  public statusCode: any;
  public message: any;

  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const {statusCode, message} = err;
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).json({
      message,
      status: 'error',
      statusCode,
    });
    next();
};
