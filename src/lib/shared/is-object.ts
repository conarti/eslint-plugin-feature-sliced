export function isObject(target: unknown): target is object {
  return (typeof target === 'object' || typeof target === 'function') && (target !== null);
}
