/* Valid: type-only import of an upper layer, allowed by allowTypeImports (default true) */
import type { AuthState } from 'src/features/auth';

export type UserAuthState = AuthState;
