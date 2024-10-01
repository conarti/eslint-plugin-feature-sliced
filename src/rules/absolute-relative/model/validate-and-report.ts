import type {
  Options,
  RuleContext,
} from '../config';
import { extractPathsInfo } from '../../../lib/feature-sliced';
import {
  hasPath,
  type ImportExportNodes,
  isIgnoredCurrentFile,
} from '../../../lib/rule';
import {
  reportShouldBeAbsolute,
  reportShouldBeRelative,
} from './errors';
import { shouldBeAbsolute } from './should-be-absolute';
import { shouldBeRelative } from './should-be-relative';

interface ValidateOptions {
  needCheckForAbsolute: boolean;
};

export function validateAndReport(
  node: ImportExportNodes,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  options: ValidateOptions = { needCheckForAbsolute: true },
) {
  if (!hasPath(node)) {
    return;
  }

  if (isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  if (shouldBeRelative(pathsInfo)) {
    reportShouldBeRelative(node, context);
  }

  if (options.needCheckForAbsolute && shouldBeAbsolute(pathsInfo)) {
    reportShouldBeAbsolute(node, context);
  }
}
