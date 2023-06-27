export = {
  plugins: [
    '@conarti/feature-sliced',
  ],
  rules: {
    '@conarti/feature-sliced/layers-slices': 'error',
    '@conarti/feature-sliced/absolute-relative': 'error',
    '@conarti/feature-sliced/public-api': 'error',
  },
};
