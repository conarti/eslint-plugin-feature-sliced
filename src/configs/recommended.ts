import path from 'path';

export = {
  plugins: [
    'conarti-fsd',
  ],
  extends: [
    path.resolve(__dirname, './import-order/recommended'),
  ],
  rules: {
    'conarti-fsd/layers-slices': 'error',
    'conarti-fsd/absolute-relative': 'error',
    'conarti-fsd/public-api': 'error',
  },
};
