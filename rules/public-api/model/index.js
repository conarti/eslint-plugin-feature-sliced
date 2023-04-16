const { convertToPublicApi } = require('./convert-to-public-api');
const { isImportFromPublicApi } = require('./is-import-from-public-api');
const { getFsdPartsFromPath } = require('./get-fsd-parts-from-path');

module.exports.convertToPublicApi = convertToPublicApi;
module.exports.isImportFromPublicApi = isImportFromPublicApi;
module.exports.getFsdPartsFromPath = getFsdPartsFromPath;
