export function errorHandler(err, req, res, next) {
  res
    .status(err.statusCode ? err.statusCode : 500)
    .send(err.message ?
      {'status': 'error', error: err.message} :
      {status: 'error', error: 'Something failed!'});
}
