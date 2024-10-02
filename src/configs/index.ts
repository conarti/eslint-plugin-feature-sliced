import type { ESLint } from 'eslint';
import { importOrder } from './import-order';
import recommended from './recommended';

export const configs = {
  recommended,
  importOrder,
} as ESLint.Plugin['configs'];
