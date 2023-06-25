import {
  canValidate,
  isIgnoredCurrentFile,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
import {
  type Options,
  type RuleContext,
} from '../config';
import { reportShouldBeFromPublicApi } from './errors-lib';
import { shouldBeFromPublicApi } from './should-be-from-public-api';

export function validateAndReport(node: ImportExportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!canValidate(node)) {
    return;
  }

  if (isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  if (shouldBeFromPublicApi(node, context, optionsWithDefault)) {
    reportShouldBeFromPublicApi(node, context);
  }
}
