module.exports.removeAlias = (targetPath, alias) => {
  if (!alias) {
    return targetPath;
  }
  return targetPath.replace(`${alias}/`, '');
};
