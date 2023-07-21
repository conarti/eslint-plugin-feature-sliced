import { type RuleTesterConfig } from '@typescript-eslint/utils/dist/ts-eslint';
import * as BaseRuleTester from '@typescript-eslint/utils/dist/ts-eslint/RuleTester';
import { Linter } from 'eslint';

export class RuleTester extends BaseRuleTester.RuleTester {
  linter: Linter;

  constructor(baseOptions: RuleTesterConfig, cwd?: string) {
    super(baseOptions);

    this.linter = new Linter({ cwd });
  }
}
