const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://hongs.onrender.com', // 백엔드 서버 주소
      changeOrigin: true,
    })
  );
};
