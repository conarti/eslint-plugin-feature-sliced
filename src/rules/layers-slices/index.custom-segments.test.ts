import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  makeCustomLayersAndSegmentsSettings,
  makeCustomLayersSlicesError,
  makeCustomSegmentsSettings,
  makeLayersSlicesError,
} from '../../../tests/utils';
import rule from './index';

/**
 * Custom segments configuration for testing (extend mode).
 * Adds 'i18n', 'hooks', 'services' to default segments.
 */
const customSegments = ['i18n', 'hooks', 'services'];

const customSegmentsSettings = makeCustomSegmentsSettings(customSegments);
const componentsSegmentSettings = makeCustomSegmentsSettings(['components']);

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('layers-slices (custom segments - extend mode)', rule, {
  valid: [
    {
      name: 'should allow import from same slice with custom segment (i18n -> model)',
      filename: 'src/entities/foo/i18n/index.ts',
      code: "import { fooModel } from '../model'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow import from lower layer when custom segment is used',
      filename: 'src/features/bar/hooks/useAuth.ts',
      code: "import { User } from '@/entities/user'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow same-slice relative import from model to custom i18n segment',
      filename: 'src/entities/policies/model/actions.ts',
      code: "import { t } from '../i18n'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow standard import with custom segments config',
      filename: 'src/features/bar/ui.tsx',
      code: "import { utils } from '@/shared/lib'",
      settings: customSegmentsSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on standard layer violation with custom segments',
      filename: 'src/entities/bar/services/api.ts',
      code: "import { AuthForm } from '@/features/auth'",
      settings: customSegmentsSettings,
      errors: [makeLayersSlicesError('features', 'entities')],
    },
    {
      name: 'should error on cross-entity import with custom segments',
      filename: 'src/entities/user/model.ts',
      code: "import { Order } from '@/entities/order'",
      settings: customSegmentsSettings,
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
  ],
});

ruleTester.run('layers-slices (custom segments - same slice relative imports)', rule, {
  valid: [
    {
      name: 'should allow entities/policies/model importing ../i18n with custom segment',
      filename: 'src/entities/policies/model/confirm-mass.ts',
      code: "import { t } from '../i18n'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow entities/schedule/model importing ../i18n with custom segment',
      filename: 'src/entities/schedule/model/actions.ts',
      code: "import { translations } from '../i18n'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow entities/groups/model importing ../i18n with custom segment',
      filename: 'src/entities/groups/model/groups-node-actions.ts',
      code: "import { labels } from '../i18n'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow import from custom segment subfolder within same slice',
      filename: 'src/entities/user/services/api.ts',
      code: "import { UserType } from '../model/types'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow relative import within components segment subfolders',
      filename: 'src/features/foo/components/bar/bar.tsx',
      code: "import { Baz } from './baz/baz'",
      settings: componentsSegmentSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on cross-entity import through custom segment path',
      filename: 'src/entities/user/i18n/index.ts',
      code: "import { Order } from '@/entities/order'",
      settings: customSegmentsSettings,
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
  ],
});

/**
 * Test with both custom layers and custom segments combined
 */
const customLayers = [
  { name: 'core', hasSlices: false },
  'domain',
  'features',
  'pages',
  { name: 'app', hasSlices: false },
];

const combinedSettings = makeCustomLayersAndSegmentsSettings(customLayers, customSegments);
const customLayersOrder = 'core -> domain -> features -> pages -> app';

ruleTester.run('layers-slices (custom segments + custom layers combined)', rule, {
  valid: [
    {
      name: 'should allow custom layer + custom segment (core -> domain)',
      filename: 'src/domain/user/services/api.ts',
      code: "import { config } from '@/core/utils'",
      settings: combinedSettings,
    },
    {
      name: 'should allow same slice relative import with custom segment in custom layer',
      filename: 'src/domain/user/hooks/useUser.ts',
      code: "import { userModel } from '../model'",
      settings: combinedSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on layer violation with custom segments and custom layers',
      filename: 'src/core/utils.ts',
      code: "import { AuthForm } from '@/features/auth'",
      settings: combinedSettings,
      errors: [makeCustomLayersSlicesError('features', 'core', customLayersOrder)],
    },
  ],
});
