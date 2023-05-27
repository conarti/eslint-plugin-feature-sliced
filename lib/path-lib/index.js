const { normalizePath } = require('./normalize-path');
const { convertToAbsolute } = require('./convert-to-absolute');
const { isPathRelative } = require('./is-path-relative');

module.exports = {
  normalizePath,
  convertToAbsolute,
  isPathRelative,
};
