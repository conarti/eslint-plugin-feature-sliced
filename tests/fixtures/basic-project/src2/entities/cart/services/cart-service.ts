export const cartService = {
  total: 0,
};

/* Valid: a sibling file inside the custom "services" segment is not a cross-segment re-export */
export * from './helpers';
