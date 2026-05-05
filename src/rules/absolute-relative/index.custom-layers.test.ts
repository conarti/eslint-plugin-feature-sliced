import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  absoluteRelativeErrors,
  makeCustomLayersSettings,
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

ruleTester.run('absolute-relative (custom layers)', rule, {
  valid: [
    {
      name: 'should allow absolute import from different custom layer (domain -> features)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { User } from '@/domain/user'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow absolute import from different custom layer (core -> features)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { config } from '@/core/config'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow relative import within same slice',
      filename: 'src/features/auth/ui.tsx',
      code: "import { authModel } from './model'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow relative import within same slice (nested)',
      filename: 'src/domain/user/model/selectors.ts',
      code: "import { userReducer } from '../reducers'",
      settings: customLayersSettings,
    },
    {
      name: 'should allow relative import within layer without slices',
      filename: 'src/core/config/api.ts',
      code: "import { BASE_URL } from './constants'",
      settings: customLayersSettings,
    },
    {
      name: 'should not recognize standard FSD layers',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from 'shared/ui/button'",
      settings: customLayersSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on relative import from different custom layer (domain -> features)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { User } from '../../domain/user'",
      settings: customLayersSettings,
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
    {
      name: 'should error on relative import from different custom layer (core -> domain)',
      filename: 'src/domain/user/model.ts',
      code: "import { config } from '../../core/config'",
      settings: customLayersSettings,
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
    {
      name: 'should error on absolute import within same custom slice',
      filename: 'src/features/auth/ui.tsx',
      code: "import { authModel } from '@/features/auth/model'",
      settings: customLayersSettings,
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should error on absolute import within same domain slice',
      filename: 'src/domain/user/model.ts',
      code: "import { userApi } from '@/domain/user/api'",
      settings: customLayersSettings,
      errors: [absoluteRelativeErrors.mustBeRelative],
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

ruleTester.run('absolute-relative (minimal layers)', rule, {
  valid: [
    {
      name: 'should allow absolute import from shared (no slices)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '@/shared/ui/button'",
      settings: minimalLayersSettings,
    },
    {
      name: 'should allow relative import within shared',
      filename: 'src/shared/ui/button.tsx',
      code: "import { Icon } from '../icon'",
      settings: minimalLayersSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on relative import from different layer (shared -> features)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '../../shared/ui/button'",
      settings: minimalLayersSettings,
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
  ],
});

/**
 * Test layer with hasSlices: false allows relative imports anywhere within it
 */
const layersWithSharedNoSlices = [
  { name: 'shared', hasSlices: false },
  'entities',
  'features',
  { name: 'app', hasSlices: false },
];

const sharedNoSlicesSettings = makeCustomLayersSettings(layersWithSharedNoSlices);

ruleTester.run('absolute-relative (shared without slices)', rule, {
  valid: [
    {
      name: 'should allow relative import anywhere in layer without slices',
      filename: 'src/shared/ui/button/index.ts',
      code: "import { Icon } from '../../icon'",
      settings: sharedNoSlicesSettings,
    },
    {
      name: 'should allow deep relative import in layer without slices',
      filename: 'src/shared/lib/hooks/useForm/validation.ts',
      code: "import { formatError } from '../../../utils/format'",
      settings: sharedNoSlicesSettings,
    },
    {
      name: 'should allow relative import in app layer',
      filename: 'src/app/providers/router/config.ts',
      code: "import { store } from '../../store'",
      settings: sharedNoSlicesSettings,
    },
  ],

  invalid: [],
});
