import { recommended } from './recommended';
import { withNewlines } from './with-newlines';
import { withNewlinesAndTypeGroup } from './with-newlines-and-type-group';
import { withTypeGroup } from './with-type-group';

export const importOrder = {
  recommended,
  'with-newlines': withNewlines,
  'with-type-group': withTypeGroup,
  'with-newlines-and-type-group': withNewlinesAndTypeGroup,
};
