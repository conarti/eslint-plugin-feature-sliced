import picomatch from 'picomatch';
import { layers } from '../../../config';
import { type PathsInfo } from '../../../lib/fsd-lib';

export function isLayerPublicApi(pathsInfo: PathsInfo): boolean {
  const { normalizedCurrentFilePath } = pathsInfo;

  const matcher = picomatch([
    `**/(${layers.join('|')})/index.*`,
  ]);

  return matcher(normalizedCurrentFilePath);
}
