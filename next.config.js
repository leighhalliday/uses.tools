const withCSS = require("@zeit/next-css");
const webpack = require("webpack");

module.exports = withCSS({
  webpack(config, _options) {
    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,
      new webpack.IgnorePlugin(/mariasql/, /\/knex\//),
      new webpack.IgnorePlugin(/mssql/, /\/knex\//),
      new webpack.IgnorePlugin(/mysql/, /\/knex\//),
      new webpack.IgnorePlugin(/mysql2/, /\/knex\//),
      new webpack.IgnorePlugin(/oracle/, /\/knex\//),
      new webpack.IgnorePlugin(/oracledb/, /\/knex\//),
      new webpack.IgnorePlugin(/pg-query-stream/, /\/knex\//),
      new webpack.IgnorePlugin(/sqlite3/, /\/knex\//),
      new webpack.IgnorePlugin(/strong-oracle/, /\/knex\//),
      new webpack.IgnorePlugin(/pg-native/, /\/pg\//)
    ];

    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL
  }
});
