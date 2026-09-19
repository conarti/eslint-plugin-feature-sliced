import type { NormalizedLayerConfig } from '../../../config';
import picomatch from 'picomatch';
import { extractLayer } from '../../../lib/feature-sliced';
import {
  extractCurrentFilePath,
  extractCwd,
  type UnknownRuleContext,
} from '../../../lib/rule';
import { isNull } from '../../../lib/shared';

export function isLayerPublicApi(context: UnknownRuleContext, layersConfig: NormalizedLayerConfig[]): boolean {
  const normalizedCurrentFilePath = extractCurrentFilePath(context);
  const cwd = extractCwd(context);
  const layer = extractLayer(normalizedCurrentFilePath, cwd, layersConfig);

  if (isNull(layer)) {
    return false;
  }

  const patterns = [
    `**/${layer}/index.*`,
  ];

  /*
   * Matched twice on purpose, the same monotone form as is-ignored.ts: picomatch's
   * `**` does not cross a path segment starting with a dot, so a project under
   * `.worktrees/` or `.cache/` never matched at all. The dot-aware result only
   * ever widens the plain one, so it cannot invert a pattern.
   */
  return picomatch(patterns)(normalizedCurrentFilePath)
    || picomatch(patterns, { dot: true })(normalizedCurrentFilePath);
}
