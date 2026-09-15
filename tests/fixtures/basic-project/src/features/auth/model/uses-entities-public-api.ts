/* Valid: downward import from the public api of a lower layer slice */
import { createUser } from 'src/entities/user';

export const guestUser = createUser('guest');
