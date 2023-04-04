const path = require('path');

module.exports = {
  extends: [
    path.resolve(__dirname, '../rules/import-order'),
    path.resolve('./base'),
  ],
};
