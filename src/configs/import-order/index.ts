import type { ImportOrderConfigName, TypedFlatConfigItem } from '../../config';
import { recommended } from './recommended';
import { withNewlines } from './with-newlines';
import { withNewlinesAndTypeGroup } from './with-newlines-and-type-group';
import { withTypeGroup } from './with-type-group';

export const importOrder: Record<ImportOrderConfigName, TypedFlatConfigItem> = {
  recommended,
  'with-newlines': withNewlines,
  'with-type-group': withTypeGroup,
  'with-newlines-and-type-group': withNewlinesAndTypeGroup,
};
