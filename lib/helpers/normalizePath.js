const path = require('path');

module.exports.normalizePath = (targetPath) => path.normalize(targetPath).replace(/\\/g, '/');
