module.exports = {
  plugins: [
    'conarti-fsd',
  ],
  rules: {
    'conarti-fsd/layers-slices': ['error', {
      allowTypeImports: true,
    }],
    'conarti-fsd/absolute-relative': 'error',
    'conarti-fsd/public-api': 'error',
  },
};
