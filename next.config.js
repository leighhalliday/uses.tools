const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  webpack(config, _options) {
    config.externals = config.externals || [];
    // issues with knex wanting to include mssql
    // https://github.com/tgriesser/knex/issues/3130
    config.externals.push({ knex: "commonjs knex" });

    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL
  }
});
