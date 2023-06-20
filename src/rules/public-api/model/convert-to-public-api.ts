import { type PathsInfo } from '../../../lib/fsd-lib';
import { isNull } from '../../../lib/shared';

function addSlashToStart(targetPath: string | null): string {
  if (isNull(targetPath)) {
    return '';
  }

  return `/${targetPath}`;
}

function extractValueToRemove(pathsInfo: PathsInfo): string | null {
  const {
    isSameSlice,
    segment,
    segmentFiles,
  } = pathsInfo;

  if (isSameSlice) {
    return segmentFiles;
  }

  return `${segment}${addSlashToStart(segmentFiles)}`;
}

export function convertToPublicApi(pathsInfo: PathsInfo): [string, (string | null)] {
  const { normalizedTargetPath } = pathsInfo;

  const valueToRemove = extractValueToRemove(pathsInfo);

  const publicApiPath = normalizedTargetPath.replace(`/${valueToRemove}`, '');

  return [publicApiPath, valueToRemove];
}
