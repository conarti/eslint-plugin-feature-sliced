import path from 'path';

export = {
  plugins: [
    '@conarti/feature-sliced',
  ],
  extends: [
    path.resolve(__dirname, './import-order/recommended'),
  ],
  rules: {
    '@conarti/feature-sliced/layers-slices': 'error',
    '@conarti/feature-sliced/absolute-relative': 'error',
    '@conarti/feature-sliced/public-api': 'error',
  },
};
