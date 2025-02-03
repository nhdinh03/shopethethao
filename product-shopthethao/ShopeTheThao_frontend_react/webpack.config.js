const { Path } = require("leaflet");

module.exports = {
    resolve: {
      alias: {
        '~': Path.resolve(__dirname, 'src/')
      }
    }
  };
  