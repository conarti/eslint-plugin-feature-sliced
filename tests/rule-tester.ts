import { RuleTester as BaseRuleTester } from '@typescript-eslint/rule-tester';

type BaseOptions = ConstructorParameters<typeof BaseRuleTester>[0];

export class RuleTester extends BaseRuleTester {
  constructor(baseOptions: BaseOptions & { cwd?: string }) {
    const { cwd, ...restOptions } = baseOptions;

    if (cwd) {
      super({
        ...restOptions,
        languageOptions: {
          ...restOptions.languageOptions,
          parserOptions: {
            ...restOptions.languageOptions?.parserOptions,
            tsconfigRootDir: cwd,
          },
        },
      });
    } else {
      super(restOptions);
    }
  }
}
