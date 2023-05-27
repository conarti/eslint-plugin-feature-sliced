const { layers } = require('../../config');

/**
 * Checks if layer is known
 * @param layer {string}
 * @returns {boolean}
 */
function isLayer(layer) {
  return layers.includes(layer);
}

/**
 * Returns layer fsd weight
 * @param layer {string}
 * @returns {null|number}
 */
function getLayerWeight(layer) {
  if (!isLayer(layer)) {
    return null;
  }

  return layers.indexOf(layer);
}

module.exports = {
  getLayerWeight,
  isLayer,
};
