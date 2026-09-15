/* Valid: absolute import of a shared helper */
import { formatDate } from 'src/shared/lib/format-date';

export const profileUpdatedAt = formatDate(new Date());
