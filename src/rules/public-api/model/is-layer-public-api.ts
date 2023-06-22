import picomatch from 'picomatch';
import { type PathsInfo } from '../../../lib/fsd-lib';

export function isLayerPublicApi(pathsInfo: PathsInfo): boolean {
  const {
    normalizedCurrentFilePath,
    fsdPartsOfCurrentFile,
  } = pathsInfo;

  const matcher = picomatch([
    `**/${fsdPartsOfCurrentFile.layer}/index.*`,
  ]);

  return matcher(normalizedCurrentFilePath);
}
