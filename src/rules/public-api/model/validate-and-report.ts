import type {
  Options,
  RuleContext,
} from '../config';
import {
  hasPath,
  type ImportExportNodes,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import { reportShouldBeFromPublicApi } from './errors';
import { shouldBeFromPublicApi } from './should-be-from-public-api';

export function validateAndReport(node: ImportExportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!hasPath(node)) {
    return;
  }

  const isIgnoredForValidation = isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnoredForValidation) {
    return;
  }

  if (shouldBeFromPublicApi(node, context, optionsWithDefault)) {
    reportShouldBeFromPublicApi(node, context);
  }
}
