/* Violation: layers-slices "can-not-import" - entities must not import features */
import { loginUser } from 'src/features/auth';

export const login = loginUser;
