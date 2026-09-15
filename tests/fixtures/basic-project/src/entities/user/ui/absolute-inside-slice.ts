/* Violation: absolute-relative "must-be-relative-path" - absolute import inside the same slice */
import { createUser } from 'src/entities/user/model/create-user';

export const anonymous = createUser('anonymous');
