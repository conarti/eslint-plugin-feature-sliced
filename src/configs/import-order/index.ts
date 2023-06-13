import recommended from './recommended';
import withNewlines from './with-newlines';
import withNewlinesAndTypeGroup from './with-newlines-and-type-group';
import withTypeGroup from './with-type-group';

export = {
  parserOptions: {
    'ecmaVersion': '2015',
    'sourceType': 'module',
  },
  configs: {
    'recommended': recommended,
    'with-newlines': withNewlines,
    'with-type-group': withTypeGroup,
    'with-newlines-and-type-group': withNewlinesAndTypeGroup,
  },
};
