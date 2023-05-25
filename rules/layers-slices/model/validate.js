const { canImportLayer } = require('./can-import-layer');

module.exports.validate = function(pathsInfo){
  return canImportLayer(pathsInfo);
};
