export function isIndexFile(segmentFiles: string): boolean {
  return /^index\.\w+/i.test(segmentFiles);
}
