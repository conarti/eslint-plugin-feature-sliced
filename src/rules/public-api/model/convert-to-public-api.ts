import { type PathsInfo } from '../../../lib/feature-sliced';
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
    fsdPartsOfTarget,
  } = pathsInfo;

  if (isSameSlice) {
    return fsdPartsOfTarget.segmentFiles;
  }

  return `${fsdPartsOfTarget.segment}${addSlashToStart(fsdPartsOfTarget.segmentFiles)}`;
}

export function convertToPublicApi(pathsInfo: PathsInfo): [string, (string | null)] {
  const { normalizedTargetPath } = pathsInfo;

  const valueToRemove = extractValueToRemove(pathsInfo);

  const publicApiPath = normalizedTargetPath.replace(`/${valueToRemove}`, '');

  return [publicApiPath, valueToRemove];
}
