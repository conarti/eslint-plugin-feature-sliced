import type { TSESTree } from '@typescript-eslint/utils';
import type {
  Options,
  RuleContext,
} from '../config';
import { isIgnoredCurrentFile } from '../../../lib/rule';
import { reportLayersPublicApiNotAllowed } from './errors';
import { isLayerPublicApi } from './is-layer-public-api';

export function validateAndReportProgram(node: TSESTree.Program, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  if (isLayerPublicApi(context)) {
    reportLayersPublicApiNotAllowed(node, context);
  }
}
