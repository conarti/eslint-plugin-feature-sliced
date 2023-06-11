export function shouldBeRelative(pathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
  } = pathsInfo;

  if (isRelative) {
    return false;
  }

  if (!importLayer || !importSlice) {
    return false;
  }

  if (!currentFileLayer && !currentFileSlice) {
    return false;
  }

  if (!currentFileSlice && importSlice && currentFileLayer === importLayer) {
    return true;
  }

  if (
    currentFileLayer === 'shared' && importLayer === 'shared'
    || currentFileLayer === 'app' && importLayer === 'app'
  ) {
    return true;
  }

  return currentFileSlice === importSlice && currentFileLayer === importLayer;
}
