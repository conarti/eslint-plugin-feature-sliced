/* Violation: import-order "noLineBetweenGroups" - the recommended preset sets "newlines-between": "never" */
import axios from 'axios';

import { createUser } from 'src/entities/user';

export const blankLineUser = createUser(axios.name);
