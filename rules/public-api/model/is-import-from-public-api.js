module.exports.isImportFromPublicApi = ({
  segment,
  isImportFromSameSlice,
}) => {
  if (!isImportFromSameSlice) {
    return segment === '';
  }

  return true;
};
