import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  makeCustomLayersSettings,
  makeCustomLayersSlicesError,
} from '../../../tests/utils';
import rule from './index';

/**
 * Custom layers configuration for testing.
 * Order: core (no slices) < domain < features < pages < app (no slices)
 */
const customLayers = [
  { name: 'core', hasSlices: false },
  'domain',
  'features',
  'pages',
  { name: 'app', hasSlices: false },
];

const customLayersSettings = makeCustomLayersSettings(customLayers);

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('layers-slices (custom layers)', rule, {
  valid: [
    {
      name: 'should allow import from lower custom layer (core -> features)',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/core/foo.tsx'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow import from lower custom layer (domain -> features)',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/domain/user/model.ts'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow import from lower custom layer (features -> pages)',
      filename: 'src/pages/home/ui.tsx',
      code: "import { Button } from '@/features/auth/ui'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow import from any layer to app',
      filename: 'src/app/App.tsx',
      code: "import { HomePage } from '@/pages/home'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow import within same slice (same layer)',
      filename: 'src/domain/user/model.ts',
      code: "import { userApi } from '@/domain/user/api'",
      settings: customLayersSettings,
    },
    {
      name: 'should not recognize standard FSD layers with custom config',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/shared/foo'",
      settings: customLayersSettings,
    },
    {
      name: 'should not recognize entities layer with custom config',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/entities/user'",
      settings: customLayersSettings,
    },
  ],

  invalid: [
    {
      name: 'should error when importing from higher custom layer (features -> domain)',
      filename: 'src/domain/user/model.ts',
      code: "import { Button } from '@/features/auth/ui'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('features', 'domain')],
    },
    {
      name: 'should error when importing from higher custom layer (domain -> core)',
      filename: 'src/core/utils.ts',
      code: "import { User } from '@/domain/user'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('domain', 'core')],
    },
    {
      name: 'should error when importing from higher custom layer (core -> features)',
      filename: 'src/core/config.ts',
      code: "import { AuthButton } from '@/features/auth'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('features', 'core')],
    },
    {
      name: 'should error when importing pages from features',
      filename: 'src/features/auth/ui.tsx',
      code: "import { HomePage } from '@/pages/home'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('pages', 'features')],
    },
    {
      name: 'should error when importing app from features',
      filename: 'src/features/auth/ui.tsx',
      code: "import { config } from '@/app/config'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('app', 'features')],
    },
  ],
});

/**
 * Test with minimal layers configuration
 */
const minimalLayers = [
  { name: 'shared', hasSlices: false },
  'features',
  { name: 'app', hasSlices: false },
];

const minimalLayersSettings = makeCustomLayersSettings(minimalLayers);

ruleTester.run('layers-slices (minimal layers)', rule, {
  valid: [
    {
      name: 'should work with minimal layers (shared -> features)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '@/shared/ui'",
      settings: minimalLayersSettings,
    },
    {
      name: 'should work with minimal layers (features -> app)',
      filename: 'src/app/App.tsx',
      code: "import { AuthFeature } from '@/features/auth'",
      settings: minimalLayersSettings,
    },
  ],

  invalid: [
    {
      name: 'should error with minimal layers (features -> shared)',
      filename: 'src/shared/ui/button.tsx',
      code: "import { AuthForm } from '@/features/auth'",
      settings: minimalLayersSettings,
      errors: [makeCustomLayersSlicesError('features', 'shared')],
    },
  ],
});

/**
 * Test with extra layers (flows between pages and app)
 */
const extraLayers = [
  { name: 'shared', hasSlices: false },
  'entities',
  'features',
  'widgets',
  'pages',
  'flows',
  { name: 'app', hasSlices: false },
];

const extraLayersSettings = makeCustomLayersSettings(extraLayers);

ruleTester.run('layers-slices (extra layers)', rule, {
  valid: [
    {
      name: 'should allow import from pages to flows',
      filename: 'src/flows/checkout/model.ts',
      code: "import { CartPage } from '@/pages/cart'",
      settings: extraLayersSettings,
    },
    {
      name: 'should allow import from flows to app',
      filename: 'src/app/App.tsx',
      code: "import { CheckoutFlow } from '@/flows/checkout'",
      settings: extraLayersSettings,
    },
  ],

  invalid: [
    {
      name: 'should error when importing flows from pages',
      filename: 'src/pages/cart/ui.tsx',
      code: "import { CheckoutFlow } from '@/flows/checkout'",
      settings: extraLayersSettings,
      errors: [makeCustomLayersSlicesError('flows', 'pages')],
    },
    {
      name: 'should error when importing flows from features',
      filename: 'src/features/cart/ui.tsx',
      code: "import { CheckoutFlow } from '@/flows/checkout'",
      settings: extraLayersSettings,
      errors: [makeCustomLayersSlicesError('flows', 'features')],
    },
  ],
});
