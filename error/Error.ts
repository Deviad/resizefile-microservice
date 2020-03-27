export class ApiError extends Error {
  public statusCode: any;
  public message: any;

  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
