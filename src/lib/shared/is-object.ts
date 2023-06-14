export const isObject = (target: unknown): target is object => (typeof target === 'object' || typeof target === 'function') && (target !== null);
