/* Violation: @x cross-import addressed to the "user" slice, used from the "product" slice */
import { userRef } from 'src/entities/session/@x/user';

export const productOwner = userRef;
