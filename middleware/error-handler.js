// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //-- Set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later.',
  };

  //-- No longer needed since we added the error code checks below
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  //-- Validation errors (missing email or password)
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join('. ');
    customError.statusCode = 400;
  }

  //-- Duplicate value errors
  if (err.code && err.code === 11000) {   // Mongoose error code. Check the err.keyValue for what the duplicate value is ('email' in this case).
    customError.msg = `Duplicate value entered for the ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = 400;
  }

  //-- Cast errors (ex: wrong jobId)
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}.`
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
