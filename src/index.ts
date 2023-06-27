import recommended from './configs/recommended';
import rules from './configs/rules';
import absoluteRelative from './rules/absolute-relative';
import layersSlices from './rules/layers-slices';
import publicApi from './rules/public-api';

export = {
  parserOptions: {
    ecmaVersion: '2015',
    sourceType: 'module',
  },
  rules: {
    'absolute-relative': absoluteRelative,
    'layers-slices': layersSlices,
    'public-api': publicApi,
  },
  configs: {
    recommended,
    rules,
  },
};
