/* Violation: public-api "should-be-from-public-api" - deep import into another slice segment */
import { UserCard } from 'src/entities/user/ui/user-card';

export const card = UserCard('deep');
