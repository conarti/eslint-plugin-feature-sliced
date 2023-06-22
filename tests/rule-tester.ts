/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type RuleTesterConfig } from '@typescript-eslint/utils/dist/ts-eslint';
import {
  Linter,
  RuleTester as EslintRuleTester,
} from 'eslint';

/* TODO fix types, use ESLintUtils.RuleTester */
export class RuleTester extends EslintRuleTester {
  linter: Linter;

  constructor(baseOptions: RuleTesterConfig, cwd?: string) {
    // @ts-ignore
    super(baseOptions);

    this.linter = new Linter({ cwd });
  }
}
