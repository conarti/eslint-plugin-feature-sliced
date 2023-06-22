import picomatch from 'picomatch';
import { extractLayer } from '../../../lib/fsd-lib';
import {
  extractCurrentFilePath,
  extractCwd,
  type UnknownRuleContext,
} from '../../../lib/rule-lib';
import { isNull } from '../../../lib/shared';

export function isLayerPublicApi(context: UnknownRuleContext): boolean {
  const { normalizedCurrentFilePath } = extractCurrentFilePath(context);
  const cwd = extractCwd(context);
  const layer = extractLayer(normalizedCurrentFilePath, cwd);

  if (isNull(layer)) {
    return false;
  }

  const matcher = picomatch([
    `**/${layer}/index.*`,
  ]);

  return matcher(normalizedCurrentFilePath);
}
