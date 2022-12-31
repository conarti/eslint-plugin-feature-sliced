module.exports.isPathRelative = (path) => {
  return path === '.' || path.startsWith('./') || path.startsWith('../');
};
