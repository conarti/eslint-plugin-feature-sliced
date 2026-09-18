import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  absoluteRelativeErrors,
  makeCustomSegmentsSettings,
} from '../../../tests/utils';
import rule from './index';

/**
 * Custom segments configuration for testing (extend mode).
 * Adds 'services' to the default segments.
 */
const customSegmentsSettings = makeCustomSegmentsSettings(['services']);

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('absolute-relative (custom segments - extend mode)', rule, {
  valid: [
    {
      name: 'should allow relative import from custom segment into default segment of the same slice',
      filename: 'src/entities/user/services/user-service.ts',
      code: "import { userModel } from '../model'",
      settings: customSegmentsSettings,
    },
    {
      name: 'should allow absolute import into another slice from custom segment',
      filename: 'src/entities/user/services/user-service.ts',
      code: "import { order } from '@/entities/order'",
      settings: customSegmentsSettings,
    },
  ],

  invalid: [
    {
      name: 'should error on absolute import from custom segment into default segment of the same slice',
      filename: 'src/entities/user/services/user-service.ts',
      code: "import { userModel } from '@/entities/user/model'",
      settings: customSegmentsSettings,
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should error on absolute import from default segment into custom segment of the same slice',
      filename: 'src/entities/user/ui/user-card.ts',
      code: "import { userService } from '@/entities/user/services'",
      settings: customSegmentsSettings,
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should error on absolute import between default segments of the same slice with custom segments configured',
      filename: 'src/entities/user/ui/user-card.ts',
      code: "import { userModel } from '@/entities/user/model'",
      settings: customSegmentsSettings,
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should error on relative cross-layer import from custom segment',
      filename: 'src/features/auth/services/auth-service.ts',
      code: "import { user } from '../../../entities/user'",
      settings: customSegmentsSettings,
      errors: [absoluteRelativeErrors.mustBeAbsolute],
    },
  ],
});
