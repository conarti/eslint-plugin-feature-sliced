import type {
  Options,
  RuleContext,
} from '../config';
import {
  hasPath,
  type ImportExportNodes,
  isIgnoredCurrentFile,
} from '../../../lib/rule';
import { reportShouldBeFromPublicApi } from './errors';
import { shouldBeFromPublicApi } from './should-be-from-public-api';

export function validateAndReport(node: ImportExportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!hasPath(node)) {
    return;
  }

  if (isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  if (shouldBeFromPublicApi(node, context, optionsWithDefault)) {
    reportShouldBeFromPublicApi(node, context);
  }
}
