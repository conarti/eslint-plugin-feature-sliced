import {
  canValidate,
  type ImportExportNodes,
} from '../../../lib/rule-lib';
import {
  type Options,
  type RuleContext,
} from '../config';
import { reportShouldBeFromPublicApi } from './errors-lib';
import { isIgnoredCurrentFile } from './is-ignored-current-file';
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
