const setParser = (config, version = '2015') => ({
  ...config,
  parserOptions: {
    'ecmaVersion': version,
    'sourceType': 'module',
  },
});

module.exports.configLib = { setParser };
