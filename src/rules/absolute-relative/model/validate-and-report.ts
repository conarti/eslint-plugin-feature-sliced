import { extractPathsInfo } from '../../../lib/feature-sliced';
import {
  hasPath,
  isIgnoredCurrentFile,
  type ImportExportNodes,
} from '../../../lib/rule';
import {
  type RuleContext,
  type Options,
} from '../config';
import {
  reportShouldBeRelative,
  reportShouldBeAbsolute,
} from './errors';
import { shouldBeAbsolute } from './should-be-absolute';
import { shouldBeRelative } from './should-be-relative';

type ValidateOptions = {
  needCheckForAbsolute: boolean;
}

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
