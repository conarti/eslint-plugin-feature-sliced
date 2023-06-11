const setParser = (config, version = '2015') => ({
  ...config,
  parserOptions: {
    'ecmaVersion': version,
    'sourceType': 'module',
  },
});

export const configLib = { setParser };
