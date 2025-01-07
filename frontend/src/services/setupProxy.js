const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:5000', // 백엔드 서버 주소
      changeOrigin: true,
    })
  );
};
