process.env.VUE_APP_VERSION = require("./package.json").version;

const PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH || '/';

module.exports = {
  publicPath: PUBLIC_PATH,
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },
  transpileDependencies: ["quasar"],
};
