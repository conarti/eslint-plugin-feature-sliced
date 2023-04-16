const { convertToPublicApi } = require('./convert-to-public-api');
const { isImportFromPublicApi } = require('./is-import-from-public-api');
const { isImportFromSameSlice } = require('./is-import-from-same-slice');

module.exports.convertToPublicApi = convertToPublicApi;
module.exports.isImportFromPublicApi = isImportFromPublicApi;
module.exports.isImportFromSameSlice = isImportFromSameSlice;
