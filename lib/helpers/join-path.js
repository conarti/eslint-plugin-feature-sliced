const path = require("path");
const { normalizePath } = require("./normalize-path");

module.exports.joinPath = (from, to) => {
  return normalizePath(path.join(normalizePath(from), normalizePath(to)));
};