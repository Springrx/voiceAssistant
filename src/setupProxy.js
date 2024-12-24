const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://10.192.48.20:8000',
      secure: false,
      changeOrigin: true,
    })
  );
};
