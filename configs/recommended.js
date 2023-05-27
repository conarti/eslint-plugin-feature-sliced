const path = require('path');

module.exports = {
  plugins: [
    'conarti-fsd',
  ],
  extends: [
    path.resolve(__dirname, './import-order'),
  ],
  rules: {
    'conarti-fsd/layers-slices': ['error', {
      allowTypeImports: true,
    }],
    'conarti-fsd/absolute-relative': 'error',
    'conarti-fsd/public-api': 'error',
  },
};
