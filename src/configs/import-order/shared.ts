import pluginImport from 'eslint-plugin-import-x';
import { layers } from '../../config';

export const plugins = {
  import: pluginImport,
};

export const LAYERS_REVERSED = [...layers].reverse();
