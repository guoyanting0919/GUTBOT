const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/notify",
    createProxyMiddleware({
      target: "https://notify-api.line.me",
      changeOrigin: true,
    })
  );
};
