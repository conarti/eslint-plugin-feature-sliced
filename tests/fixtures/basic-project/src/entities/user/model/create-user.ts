export interface User {
  id: string;
}

export function createUser(id: string): User {
  return { id };
}
