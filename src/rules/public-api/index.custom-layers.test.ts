import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  CUSTOM_LAYERS,
  LAYERS_WITH_CORE_WITHOUT_SLICES,
  makeCustomLayersSettings,
  makePublicApiErrorWithSuggestion,
  publicApiLayersNotAllowedError,
} from '../../../tests/utils';
import rule from './index';

const customLayersSettings = makeCustomLayersSettings(CUSTOM_LAYERS);

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('public-api (custom layers)', rule, {
  valid: [
    {
      name: 'should allow import from custom layer public api (domain)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { User } from '@/domain/user'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow import from custom layer public api (features)',
      filename: 'src/pages/home/ui.tsx',
      code: "import { AuthForm } from '@/features/auth'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow import from layer without slices (core)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { config } from '@/core/config'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow deep import from layer without slices (core)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { API_URL } from '@/core/config/api'",
      settings: customLayersSettings,
    },
    {
      name: 'should not recognize standard FSD layers as known',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '@/shared/ui/button/styles'",
      settings: customLayersSettings,
    },
    {
      name: 'should keep a custom layer slice public api silent (issue #34)',
      filename: 'src/domain/user/index.ts',
      code: "export { User } from './model'",
      settings: customLayersSettings,
    },
    /*
     * The removing half of reading the configured layers: a standard FSD name
     * the layers setting does not list is not a layer, so its index file is an
     * ordinary file. This is the same rule as "should not recognize standard
     * FSD layers as known" above, applied to the Program pass (issue #34)
     */
    {
      name: 'should not report a standard FSD layer public api when the layers setting omits it (issue #34)',
      filename: 'src/entities/index.ts',
      code: "export { User } from './user'",
      settings: customLayersSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on deep import from custom layer with slices (domain)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { UserModel } from '@/domain/user/model'",
      settings: customLayersSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'model',
          "import { UserModel } from '@/domain/user'",
          '@/domain/user',
        ),
      ],
    },
    {
      name: 'should error on deep import from custom layer with slices (features)',
      filename: 'src/pages/home/ui.tsx',
      code: "import { authStore } from '@/features/auth/model/store'",
      settings: customLayersSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/store',
          "import { authStore } from '@/features/auth'",
          '@/features/auth',
        ),
      ],
    },
    {
      name: 'should error on deep import from pages',
      filename: 'src/app/App.tsx',
      code: "import { HomeHeader } from '@/pages/home/ui/header'",
      settings: customLayersSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'ui/header',
          "import { HomeHeader } from '@/pages/home'",
          '@/pages/home',
        ),
      ],
    },
    {
      name: 'should error on a custom layer public api (domain) (issue #34)',
      filename: 'src/domain/index.ts',
      code: "export { User } from './user'",
      settings: customLayersSettings,
      errors: [publicApiLayersNotAllowedError],
    },
  ],
});

/**
 * Test with layer that has hasSlices: false - should allow deep imports
 */
const coreNoSlicesSettings = makeCustomLayersSettings(LAYERS_WITH_CORE_WITHOUT_SLICES);

ruleTester.run('public-api (layer without slices)', rule, {
  valid: [
    {
      name: 'should allow deep import from layer with hasSlices: false',
      filename: 'src/features/auth/ui.tsx',
      code: "import { API_URL } from '@/core/config/api/endpoints'",
      settings: coreNoSlicesSettings,
    },
    {
      name: 'should allow any depth import from layer with hasSlices: false',
      filename: 'src/features/auth/ui.tsx',
      code: "import { helper } from '@/core/utils/helpers/string/format'",
      settings: coreNoSlicesSettings,
    },
    {
      name: 'should allow deep import from app layer',
      filename: 'src/features/auth/ui.tsx',
      code: "import { router } from '@/app/providers/router/config'",
      settings: coreNoSlicesSettings,
    },
  ],

  invalid: [
    {
      name: 'should still error on deep import from layer with slices',
      filename: 'src/app/App.tsx',
      code: "import { authModel } from '@/features/auth/model'",
      settings: coreNoSlicesSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'model',
          "import { authModel } from '@/features/auth'",
          '@/features/auth',
        ),
      ],
    },
    /*
     * hasSlices only decides whether a layer is split into slices, it never
     * exempts the layer itself from the public api check, so "core" behaves
     * exactly like the default "shared" layer does (issue #34)
     */
    {
      name: 'should error on the public api of a layer declared without slices (core)',
      filename: 'src/core/index.ts',
      code: "export { config } from './config'",
      settings: coreNoSlicesSettings,
      errors: [publicApiLayersNotAllowedError],
    },
  ],
});
