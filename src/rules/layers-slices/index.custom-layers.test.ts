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
const customLayersOrder = 'core -> domain -> features -> pages -> app';

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
      errors: [makeCustomLayersSlicesError('features', 'domain', customLayersOrder)],
    },
    {
      name: 'should error when importing from higher custom layer (domain -> core)',
      filename: 'src/core/utils.ts',
      code: "import { User } from '@/domain/user'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('domain', 'core', customLayersOrder)],
    },
    {
      name: 'should error when importing from higher custom layer (core -> features)',
      filename: 'src/core/config.ts',
      code: "import { AuthButton } from '@/features/auth'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('features', 'core', customLayersOrder)],
    },
    {
      name: 'should error when importing pages from features',
      filename: 'src/features/auth/ui.tsx',
      code: "import { HomePage } from '@/pages/home'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('pages', 'features', customLayersOrder)],
    },
    {
      name: 'should error when importing app from features',
      filename: 'src/features/auth/ui.tsx',
      code: "import { config } from '@/app/config'",
      settings: customLayersSettings,
      errors: [makeCustomLayersSlicesError('app', 'features', customLayersOrder)],
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
const minimalLayersOrder = 'shared -> features -> app';

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
      errors: [makeCustomLayersSlicesError('features', 'shared', minimalLayersOrder)],
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
const extraLayersOrder = 'shared -> entities -> features -> widgets -> pages -> flows -> app';

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
      errors: [makeCustomLayersSlicesError('flows', 'pages', extraLayersOrder)],
    },
    {
      name: 'should error when importing flows from features',
      filename: 'src/features/cart/ui.tsx',
      code: "import { CheckoutFlow } from '@/flows/checkout'",
      settings: extraLayersSettings,
      errors: [makeCustomLayersSlicesError('flows', 'features', extraLayersOrder)],
    },
  ],
});

/**
 * Test allowSliceCrossImports option
 * When enabled for a layer, cross-imports between slices of that layer are allowed.
 */
const layersWithCrossImports = [
  { name: 'shared', hasSlices: false },
  { name: 'modules', hasSlices: true, allowSliceCrossImports: true },
  'features',
  { name: 'app', hasSlices: false },
];

const crossImportsSettings = makeCustomLayersSettings(layersWithCrossImports);
const crossImportsLayersOrder = 'shared -> modules -> features -> app';

ruleTester.run('layers-slices (allowSliceCrossImports)', rule, {
  valid: [
    {
      name: 'should allow cross-slice import when allowSliceCrossImports is true',
      filename: 'src/modules/user/model.ts',
      code: "import { Order } from '@/modules/order'",
      settings: crossImportsSettings,
    },
    {
      name: 'should allow cross-slice import with relative path',
      filename: 'src/modules/user/ui/Card.tsx',
      code: "import { orderModel } from '../../order/model'",
      settings: crossImportsSettings,
    },
    {
      name: 'should still allow same-slice import',
      filename: 'src/modules/user/ui.ts',
      code: "import { userModel } from '@/modules/user/model'",
      settings: crossImportsSettings,
    },
    {
      name: 'should still allow import from lower layer',
      filename: 'src/modules/user/model.ts',
      code: "import { api } from '@/shared/api'",
      settings: crossImportsSettings,
    },
    {
      name: 'should allow import from modules to features',
      filename: 'src/features/auth/model.ts',
      code: "import { User } from '@/modules/user'",
      settings: crossImportsSettings,
    },
  ],

  invalid: [
    {
      name: 'should still error cross-slice in layer without allowSliceCrossImports',
      filename: 'src/features/auth/model.ts',
      code: "import { cart } from '@/features/cart'",
      settings: crossImportsSettings,
      errors: [makeCustomLayersSlicesError('features', 'features', crossImportsLayersOrder)],
    },
    {
      name: 'should still error import from higher layer',
      filename: 'src/modules/user/model.ts',
      code: "import { AuthFeature } from '@/features/auth'",
      settings: crossImportsSettings,
      errors: [makeCustomLayersSlicesError('features', 'modules', crossImportsLayersOrder)],
    },
    {
      name: 'should error when importing from modules layer to shared',
      filename: 'src/shared/utils.ts',
      code: "import { User } from '@/modules/user'",
      settings: crossImportsSettings,
      errors: [makeCustomLayersSlicesError('modules', 'shared', crossImportsLayersOrder)],
    },
  ],
});
