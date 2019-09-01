module.exports = api => {
  api.cache(true);
  return {
    presets: ["next/babel", "@emotion/babel-preset-css-prop"],
    plugins: [
      "emotion",
      [
        "module-resolver", // babel-plugin-module-resolver
        {
          alias: {
            "@pages": "./src/pages",
            "@client": "./src/client",
            "@components": "./src/components",
            "@server": "./src/server",
            "@generated": "./src/generated"
          },
          extensions: [".ts", ".tsx"]
        }
      ]
    ]
  };
};
