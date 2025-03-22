const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://10.176.56.192:8342',
      secure: false,
      changeOrigin: true,
    })
  );
};
