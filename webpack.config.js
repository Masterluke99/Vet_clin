// This file fixes the webpack dev server deprecation warnings
module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Custom middleware setup here if needed
      return middlewares;
    }
  }
};
