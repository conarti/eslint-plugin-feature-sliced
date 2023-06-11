export function shouldBeAbsolute(pathsInfo): boolean {
  const {
    isRelative,
    importLayer,
    currentFileLayer,
  } = pathsInfo;

  if (!isRelative) {
    return false;
  }

  if (!importLayer) {
    return false;
  }

  if (!currentFileLayer) {
    return false;
  }

  return currentFileLayer !== importLayer;
}
