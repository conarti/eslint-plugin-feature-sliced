/* Valid: absolute import across layers from a slice public api */
import { Header } from 'src/widgets/header';

export function HomePage(): string {
  return Header('home');
}
