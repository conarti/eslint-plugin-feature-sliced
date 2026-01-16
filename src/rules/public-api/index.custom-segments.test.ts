import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
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
