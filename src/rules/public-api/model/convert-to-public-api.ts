const addSlashToStart = (targetPath) => targetPath ? `/${targetPath}` : '';

export function convertToPublicApi(pathsInfo): [string, string] {
  const {
    normalizedImportPath,
    isSameSlice,
    segmentFiles,
    segment,
  } = pathsInfo;

  const valueToRemove = isSameSlice
    ? segmentFiles
    : `${segment}${addSlashToStart(segmentFiles)}`;

  const publicApiPath = normalizedImportPath.replace(`/${valueToRemove}`, '');

  return [publicApiPath, valueToRemove];
}
