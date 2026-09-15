/* Violation: absolute-relative "must-be-absolute-path" - relative import into another layer */
import { createUser } from '../../../entities/user';

export const headerUser = createUser('header');
