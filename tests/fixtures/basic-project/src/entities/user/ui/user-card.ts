/* Valid: relative import inside the same slice */
import { createUser } from '../model/create-user';

export function UserCard(id: string) {
  return createUser(id);
}
