import type { ESLint } from 'eslint';
import { version } from '../package.json';
import { PLUGIN_NAME } from './config';
import rules from './rules';

export const plugin: ESLint.Plugin = {
  meta: {
    name: PLUGIN_NAME,
    version,
  },
  rules,
};
