/* Violation: layers-slices "can-not-import" and public-api "should-be-from-public-api" */
import { thing } from 'src/entities/panel/other/ui/thing';

export const usesSibling = thing;
