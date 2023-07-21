import { TSESLint } from '@typescript-eslint/utils';
import { Linter } from 'eslint';

type BaseOptions = ConstructorParameters<typeof TSESLint.RuleTester>[0];

export class RuleTester extends TSESLint.RuleTester {
  linter: Linter;

  constructor(baseOptions: BaseOptions, cwd?: string) {
    super(baseOptions);

    this.linter = new Linter({ cwd });
  }
}
