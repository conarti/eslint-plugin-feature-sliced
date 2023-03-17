const { convertToPublicApi } = require('./convert-to-public-api');
const { getSegmentsFromPath } = require('./get-segments-from-path');
const { isImportFromPublicApi } = require('./is-import-from-public-api');
const { isImportFromSameSlice } = require('./is-import-from-same-slice');

module.exports.convertToPublicApi = convertToPublicApi;
module.exports.getSegmentsFromPath = getSegmentsFromPath;
module.exports.isImportFromPublicApi = isImportFromPublicApi;
module.exports.isImportFromSameSlice = isImportFromSameSlice;
