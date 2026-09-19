/* Invalid: the import stays inside the widgets/header slice, so it has to be written as a relative path */
import { useHeader } from 'src/widgets/header/hooks';

export const headerTitle = useHeader();
