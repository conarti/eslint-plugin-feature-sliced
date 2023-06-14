import type { PathsInfo } from '../../../lib/fsd-lib';

const addSlashToStart = (targetPath: string) => targetPath ? `/${targetPath}` : '';

export function convertToPublicApi(pathsInfo: PathsInfo): [string, string] {
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
