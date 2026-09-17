import type {
  ExportNodes,
  ExportNodesWithSource,
  ImportExportNodesWithSourceValue,
  ImportNodes,
  ImportNodesWithSource,
} from './models';
import { isObject } from '../shared';

type ImportOrExportNodeWithSource<T> = T extends ImportNodes
  ? ImportNodesWithSource
  : T extends ExportNodes
    ? ExportNodesWithSource
    : ImportExportNodesWithSourceValue;

function hasStringSourceValue(source: unknown): boolean {
  return isObject(source) && 'value' in source && typeof source.value === 'string';
}

/**
 * Checks if a node has a path for validation.
 * This function can be used in any rule because all rules only check paths.
 * @example ```
 *  export { foo }; // false, can't validate by rules
 *  export const foo = 'foo'; // false
 *  import(`./locales/${locale}.json`); // false, the source is not a string literal
 *  export * from './foo'; // true, can validate
 *  export * as bar from './foo'; // true
 *  import './foo'; // true
 *  import foo from './foo'; // true
 * ```
 */
export function hasPath(node: unknown): node is ImportOrExportNodeWithSource<typeof node> {
  if (isObject(node) && 'source' in node) {
    return hasStringSourceValue(node.source);
  }

  return false;
}
