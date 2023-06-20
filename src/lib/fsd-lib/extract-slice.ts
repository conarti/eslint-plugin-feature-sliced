import { layersWithSlices } from '../../config';
import { getByRegExp } from '../shared';

/**
 * Returns the slice from the path
 */
export function extractSlice(targetPath: string): string | null {
  const targetPathWithoutCurrentFileName = targetPath.replace(/\/\w+\.\w+$/, '');
  return getByRegExp(targetPathWithoutCurrentFileName, new RegExp(`(?<=(${layersWithSlices.join('|')})\\/)(\\w|-)+`, 'ig'), true);
}
