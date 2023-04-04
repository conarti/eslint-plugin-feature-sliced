const path = require('path');

module.exports = {
  extends: [
    path.resolve(__dirname, './import-order'),
    path.resolve('./base'),
  ],
};
