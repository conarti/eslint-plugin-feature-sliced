/* Invalid: UserA and UserB are two slices under one group folder, so this crosses a slice boundary */
import { userB } from '../../UserB/ui/user-b';

export const userA = `a-${userB}`;
