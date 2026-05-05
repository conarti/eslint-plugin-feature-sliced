import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  absoluteRelativeErrors,
  makeAbsoluteRelativeOptions,
} from '../../../tests/utils';
import rule from './index';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('absolute-relative', rule, {
  valid: [
    {
      name: 'should be valid if relative import within same slice',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { TheHeader } from './TheHeader';",
    },
    {
      name: 'should be valid if absolute import from another layer',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { useBar } from 'src/shared/hooks';",
    },
    {
      name: 'should be valid if relative import within same slice (lib)',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { useBar } from '../../lib';",
    },
    {
      name: 'should be valid if relative import within same layer (app)',
      filename: 'src/app/App.tsx',
      code: "import { AppRouter } from './providers/router';",
    },
    {
      name: 'should be valid if absolute import from another layer (widgets)',
      filename: 'src/app/App.tsx',
      code: "import { Foo } from 'widgets/foo';",
    },
    {
      name: 'should be valid if relative import within same slice (pages)',
      filename: 'src/pages/passport-info-case-edit/lib/index.ts',
      code: "import generatePayloadMapper from './generatePayloadMapper';",
    },
    {
      name: 'should be valid if re-export from same slice (star export)',
      filename: 'src/widgets/payments-widget-wrapper/index.ts',
      code: "export * from './model';",
    },
    {
      name: 'should be valid if re-export from same slice (named export)',
      filename: 'src/components/blocks/MarriageDetails/index.ts',
      code: "export { MarriageDetails } from './MarriageDetails';",
    },
    {
      name: 'should be valid if it has ignoreFiles option',
      filename: 'src/shared/foo/index.ts',
      code: "import { BAR } from '@/shared/bar';",
      options: makeAbsoluteRelativeOptions({ ignoreFiles: ['**/*/shared/foo/**/*'] }),
    },
    {
      name: "should be valid if it has slice with 'layer' name",
      filename: 'src/processes/shared/index.ts',
      code: 'import { BAR } from \'@/shared/constants\';',
    },
    {
      name: 'should be valid if the import is not from a layer (absolute import)',
      filename: 'src/shared/foo/index.ts',
      code: 'import { BAR } from \'@/bar\';',
    },
    {
      name: 'should be valid if the import is not from a layer (relative import)',
      filename: 'src/shared/foo/index.ts',
      code: "import { BAR } from '../../../bar';",
    },
    {
      name: 'should be valid if the import is not from a slice (absolute import)',
      filename: 'src/shared/foo/index.ts',
      code: "import { Something } from '@/app';",
    },
    {
      name: 'should correct understand node module imports',
      filename: 'src/shims-vue.d.ts',
      code: "import type Vue from 'vue';",
    },
  ],

  invalid: [
    {
      name: 'should report relative if import same slice with alias',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'@/widgets/TheHeader\';',
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report absolute if relative import from another layer',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'../../../shared/hooks\';',
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
    {
      name: 'should report relative if absolute import from same slice',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'src/widgets/TheHeader/lib\';',
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report relative if import within same layer (app)',
      filename: 'src/app/App.tsx',
      code: 'import { AppRouter } from \'app/providers/router\';',
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report absolute if relative import from another layer (features)',
      filename: 'src/app/App.tsx',
      code: 'import { Foo } from \'../features/foo\';',
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
    {
      name: 'should report relative if absolute import within same layer (shared)',
      filename: 'src/shared/ui/AppSelect/AppSelect.tsx',
      code: 'import CheckIcon from \'shared/assets/icons/check.svg\';',
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report relative if absolute import within same layer (app with src prefix)',
      filename: 'src/app/foo/bar/ui.tsx',
      code: 'import { Baz } from \'src/app/baz\';',
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report absolute if relative import from layer public api',
      filename: 'src/shared/foo/index.ts',
      code: "import { Something } from '../../app';",
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
    {
      name: 'should report relative if import to entities layer public api file',
      filename: 'src/entities/index.ts',
      code: "import { foo } from 'entities/foo';",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report relative if import to shared layer public api file',
      filename: 'src/shared/index.ts',
      code: "import { foo } from 'shared/foo';",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
  ],
});

/* === @x cross-import tests === */

ruleTester.run('absolute-relative (@x cross-imports)', rule, {
  valid: [
    {
      name: '@x cross-import with alias prefix',
      filename: 'src/entities/policies/ui/Component.vue',
      code: "import { useGroups } from '@/entities/groups/@x/policies';",
    },
    {
      name: '@x cross-import without alias',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from 'entities/User/@x/Session';",
    },
    {
      name: '@x cross-import with .ts extension',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from '@/entities/User/@x/Session.ts';",
    },
    {
      name: '@x cross-import from nested file',
      filename: 'src/entities/Session/ui/Card.tsx',
      code: "import { User } from '@/entities/User/@x/Session';",
    },
    {
      name: '@x cross-import with hyphenated slice names',
      filename: 'src/entities/user-session/model.ts',
      code: "import { UserProfile } from '@/entities/user-profile/@x/user-session';",
    },
  ],
  invalid: [],
});

/* === Group folders smoke tests === */

ruleTester.run('absolute-relative (group folders)', rule, {
  valid: [
    {
      name: 'should allow relative import within same slice with group folder',
      filename: 'src/entities/group/User/ui/index.ts',
      code: "import { userModel } from '../model';",
    },
    {
      name: 'should allow absolute import from another slice with group folder',
      filename: 'src/features/auth/Feature/ui/index.ts',
      code: "import { User } from '@/entities/users/User';",
    },
  ],
  invalid: [
    {
      name: 'should report relative if absolute import within same slice with group folder',
      filename: 'src/entities/group/User/ui/index.ts',
      code: "import { userModel } from '@/entities/group/User/model';",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
  ],
});
