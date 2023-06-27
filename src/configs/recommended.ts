import path from 'path';

export = {
  extends: [
    path.resolve(__dirname, './rules'),
    path.resolve(__dirname, './import-order/recommended'),
  ],
};
