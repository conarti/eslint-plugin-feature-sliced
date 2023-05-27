/**
 * Checks if a node has a path for validation.
 * This function can be used in any rule because all rules only check paths.
 * @example ```
 *  export { foo }; // false, can't validate by rules
 *  export const foo = 'foo'; // false
 *  export * from './foo'; // true, can validate
 *  export * as bar from './foo'; // true
 *  import './foo'; // true
 *  import foo from './foo'; // true
 * ```
 * @param node
 * @returns {boolean}
 */
module.exports.canValidate = (node) => node.source !== null;
