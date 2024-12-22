const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://85092b5e-3acc-481c-a51f-5ece138d3bef.mock.pstmn.io',
      secure: false,
      changeOrigin: true,
    })
  );
};
