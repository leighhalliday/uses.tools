const { appsignal } = require("./appsignal");
const {
  getRequestHandler,
  EXPERIMENTAL: { getWebVitalsHandler },
} = require("@appsignal/nextjs");
const {
  expressErrorHandler,
  expressMiddleware,
} = require("@appsignal/express");
const next = require("next");
const express = require("express");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app.prepare().then(() => {
  express()
    .use(expressMiddleware(appsignal))
    .use(getWebVitalsHandler(appsignal))
    .use(getRequestHandler(appsignal, app))
    .use(expressErrorHandler(appsignal))
    .listen(PORT, (err) => {
      if (err) {
        throw err;
      }

      console.log(`> Ready on http://localhost:${PORT}`);
    });
});
