import { TSESLint } from '@typescript-eslint/utils';
import { Linter } from 'eslint';

type BaseOptions = ConstructorParameters<typeof TSESLint.RuleTester>[0];

function removeField<T extends Record<string, any>, K extends keyof T>(objectLike: T, key: K): Omit<T, K> {
  const entries = Object.entries(objectLike);

  type ResultKeys = Exclude<keyof T, K>

  const entriesWithoutKey = entries.filter(
    (entryTuple: [keyof T, T[keyof T]]): entryTuple is [ResultKeys, T[ResultKeys]] => entryTuple[0] !== key,
  );
  return Object.fromEntries(entriesWithoutKey) as Omit<T, K>;
}

export class RuleTester extends TSESLint.RuleTester {
  linter: Linter;

  constructor(baseOptions: BaseOptions & { cwd?: string }) {
    const baseOptionsWithoutCwd = removeField(baseOptions, 'cwd');

    super(baseOptionsWithoutCwd);

    this.linter = new Linter({ cwd: baseOptions.cwd });
  }
}
