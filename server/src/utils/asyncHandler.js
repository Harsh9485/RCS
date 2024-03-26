const asyncHandler = (requestHandler) => {
  // requestHandler a asynchronous function, useing Promise.resolve to handle the error
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      console.log("async handler error: " + error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    });
  };
};

export { asyncHandler };
