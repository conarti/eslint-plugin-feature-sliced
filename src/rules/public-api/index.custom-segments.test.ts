import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  makeCustomLayersAndSegmentsSettings,
  makeCustomSegmentsSettings,
  makePublicApiErrorWithSuggestion,
  makePublicApiOptions,
  makeUnknownSegmentError,
} from '../../../tests/utils';
import { VALIDATION_LEVEL } from './config';
import rule from './index';

/**
 * Custom segments configuration for testing (extend mode).
 * Adds 'services' and 'hooks' to default segments.
 */
const customSegmentsExtend = ['services', 'hooks'];
const extendSegmentsSettings = makeCustomSegmentsSettings(customSegmentsExtend);

/**
 * Custom segments configuration for testing (replace mode).
 * Only allows 'ui', 'model', and 'services'.
 */
const customSegmentsReplace = { replace: ['ui', 'model', 'services'] };
const replaceSegmentsSettings = makeCustomSegmentsSettings(customSegmentsReplace);

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('public-api (custom segments - extend mode)', rule, {
  valid: [
    {
      name: 'should allow import from default segment (ui)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '@/entities/user'",
      settings: extendSegmentsSettings,
    },
    {
      name: 'should allow import from custom segment (services) via public API',
      filename: 'src/features/auth/ui.tsx',
      code: "import { userService } from '@/entities/user'",
      settings: extendSegmentsSettings,
    },
    {
      name: 'should allow import from slice public API when using custom segments',
      filename: 'src/pages/home/ui.tsx',
      code: "import { AuthForm } from '@/features/auth'",
      settings: extendSegmentsSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on deep import from default segment',
      filename: 'src/features/auth/ui.tsx',
      code: "import { UserModel } from '@/entities/user/model'",
      settings: extendSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'model',
          "import { UserModel } from '@/entities/user'",
          '@/entities/user',
        ),
      ],
    },
    {
      name: 'should error on deep import from custom segment (services)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/user/services'",
      settings: extendSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'services',
          "import { api } from '@/entities/user'",
          '@/entities/user',
        ),
      ],
    },
    {
      name: 'should error on deep import from custom segment (hooks)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { useUser } from '@/entities/user/hooks'",
      settings: extendSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'hooks',
          "import { useUser } from '@/entities/user'",
          '@/entities/user',
        ),
      ],
    },
    {
      name: 'should error on deep import from nested custom segment path',
      filename: 'src/features/auth/ui.tsx',
      code: "import { useAuth } from '@/entities/user/hooks/useAuth'",
      settings: extendSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'hooks/useAuth',
          "import { useAuth } from '@/entities/user'",
          '@/entities/user',
        ),
      ],
    },
  ],
});

ruleTester.run('public-api (custom segments - replace mode)', rule, {
  valid: [
    {
      name: 'should allow import from included segment (ui)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '@/entities/user'",
      settings: replaceSegmentsSettings,
    },
    {
      name: 'should allow import from included segment (services)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/user'",
      settings: replaceSegmentsSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on deep import from included segment',
      filename: 'src/features/auth/ui.tsx',
      code: "import { UserModel } from '@/entities/user/model'",
      settings: replaceSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'model',
          "import { UserModel } from '@/entities/user'",
          '@/entities/user',
        ),
      ],
    },
    {
      name: 'should error on deep import from custom segment (services)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/user/services'",
      settings: replaceSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'services',
          "import { api } from '@/entities/user'",
          '@/entities/user',
        ),
      ],
    },
  ],
});

ruleTester.run('public-api (unknown segment detection)', rule, {
  valid: [
    {
      name: 'should not error for import from public API (no segment)',
      filename: 'src/features/auth/ui.tsx',
      code: "import { Button } from '@/entities/user'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
    {
      name: 'should not error for import from public API with custom segments',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/user'",
      settings: extendSegmentsSettings,
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
  ],

  invalid: [
    {
      name: 'should error on unknown segment with default config',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/user/unknown'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('unknown'),
      ],
    },
    {
      name: 'should error on unknown segment with extend config',
      filename: 'src/features/auth/ui.tsx',
      code: "import { something } from '@/entities/user/stores'",
      settings: extendSegmentsSettings,
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('stores'),
      ],
    },
    {
      name: 'should error on segment not in replace list',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/user/lib'",
      settings: replaceSegmentsSettings,
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('lib'),
      ],
    },
  ],
});

/**
 * Custom layers + custom segments combined configuration
 */
const customLayersAndSegmentsSettings = makeCustomLayersAndSegmentsSettings(
  [
    { name: 'shared', hasSlices: false },
    'domain',
    'features',
    { name: 'app', hasSlices: false },
  ],
  ['services', 'hooks'],
);

ruleTester.run('public-api (custom layers + custom segments)', rule, {
  valid: [
    {
      name: 'should allow import from public API with custom layers and segments',
      filename: 'src/features/auth/ui.tsx',
      code: "import { User } from '@/domain/user'",
      settings: customLayersAndSegmentsSettings,
    },
    {
      name: 'should recognize custom segment with custom layers',
      filename: 'src/features/auth/ui.tsx',
      code: "import { domainService } from '@/domain/user'",
      settings: customLayersAndSegmentsSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on deep import with custom layers and segments',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/domain/user/services'",
      settings: customLayersAndSegmentsSettings,
      errors: [
        makePublicApiErrorWithSuggestion(
          'services',
          "import { api } from '@/domain/user'",
          '@/domain/user',
        ),
      ],
    },
  ],
});

ruleTester.run('public-api (group folders with unknown segment)', rule, {
  valid: [
    {
      name: 'should not error for known segment in group folder path',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/(users)/admin/model'",
      settings: extendSegmentsSettings,
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
  ],

  invalid: [
    {
      name: 'should error on unknown segment in group folder path',
      filename: 'src/features/auth/ui.tsx',
      code: "import { api } from '@/entities/(users)/admin/unknown'",
      settings: extendSegmentsSettings,
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('unknown'),
      ],
    },
  ],
});

/*
 * A group folder such as "(admin)" must be balanced (starts with "(" and ends with ")")
 * to be skipped when locating the segment. A near miss with an unbalanced paren is kept
 * as a real path part, which shifts which part is treated as the potential segment.
 */
ruleTester.run('public-api (unknown segment - group folder detection)', rule, {
  valid: [],

  invalid: [
    {
      name: 'should treat a balanced group folder as skippable when locating the segment',
      filename: 'src/pages/home/ui.tsx',
      code: "import { api } from '@/entities/(admin)/orders/helpers/x'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('helpers'),
      ],
    },
    {
      name: 'should not treat an unbalanced near-miss group folder as skippable',
      filename: 'src/pages/home/ui.tsx',
      code: "import { api } from '@/entities/(admin/orders/helpers/x'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('orders'),
      ],
    },
  ],
});

/*
 * The target path is split on "/" and empty parts are filtered out, so a leading or
 * doubled slash must not shift the position used to locate the potential segment.
 */
ruleTester.run('public-api (unknown segment - path normalization)', rule, {
  valid: [],

  invalid: [
    {
      name: 'should ignore a doubled slash right after the alias',
      filename: 'src/pages/home/ui.tsx',
      code: "import { api } from '@//entities/orders/unknown'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('unknown'),
      ],
    },
    {
      name: 'should ignore a doubled slash in the middle of the path',
      filename: 'src/pages/home/ui.tsx',
      code: "import { api } from '@/entities/orders//unknown'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('unknown'),
      ],
    },
  ],
});

/*
 * The file extension must be stripped from the potential segment before it is checked
 * against the known segments list, so an extension-bearing and extension-free import
 * of the same unknown segment must report the same segment name.
 */
ruleTester.run('public-api (unknown segment - extension handling)', rule, {
  valid: [],

  invalid: [
    {
      name: 'should report the same unknown segment when it has a file extension',
      filename: 'src/pages/home/ui.tsx',
      code: "import { api } from '@/entities/orders/helpers.ts'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('helpers'),
      ],
    },
    {
      name: 'should report the same unknown segment when it has no file extension',
      filename: 'src/pages/home/ui.tsx',
      code: "import { api } from '@/entities/orders/helpers'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makeUnknownSegmentError('helpers'),
      ],
    },
  ],
});

/*
 * When the import already resolves to a known segment, a deep import beyond it must
 * be reported as a regular public-api violation, never as an unknown segment, even
 * when an extra path part sits between the layer and the slice.
 */
ruleTester.run('public-api (unknown segment - deep import into known segment)', rule, {
  valid: [],

  invalid: [
    {
      name: 'should not report unknown segment for a deep import into a default known segment',
      filename: 'src/features/checkout/ui.tsx',
      code: "import { reducer } from '@/entities/orders/order-checkout/model/reducer'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/reducer',
          "import { reducer } from '@/entities/orders/order-checkout'",
          '@/entities/orders/order-checkout',
        ),
      ],
    },
    {
      name: 'should not report unknown segment for a deep import into a custom known segment',
      filename: 'src/features/checkout/ui.tsx',
      code: "import { client } from '@/entities/orders/order-checkout/services/order-client'",
      settings: extendSegmentsSettings,
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makePublicApiErrorWithSuggestion(
          'services/order-client',
          "import { client } from '@/entities/orders/order-checkout'",
          '@/entities/orders/order-checkout',
        ),
      ],
    },
  ],
});

/*
 * When no potential segment can be extracted at all (a bare slice import with nothing
 * left after the layer), the import is valid public API access and must not error.
 */
ruleTester.run('public-api (unknown segment - no potential segment)', rule, {
  valid: [
    {
      name: 'should not error when there is no potential segment to check',
      filename: 'src/features/checkout/ui.tsx',
      code: "import { api } from '@/entities/orders'",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
  ],

  invalid: [],
});
