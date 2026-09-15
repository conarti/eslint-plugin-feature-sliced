/* Violation: import-order - an external package imported after a layer import */
import { createUser } from 'src/entities/user';
import axios from 'axios';

export const client = axios;
export const widgetUser = createUser('widget');
