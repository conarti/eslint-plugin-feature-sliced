/**
 * @deprecated
 */
module.exports.getAliasFromOptions = (context) => {
  return context.options[0]?.alias || null;
};
