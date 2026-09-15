import type { User } from '../model/create-user';

export async function fetchUser(id: string): Promise<User> {
  return { id };
}
