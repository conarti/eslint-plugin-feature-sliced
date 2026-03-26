import pluginImport from 'eslint-plugin-import-x';
import absoluteRelative from './absolute-relative';
import layersSlices from './layers-slices';
import noCrossSegmentReexport from './no-cross-segment-reexport';
import publicApi from './public-api';

// @keep-sorted
const rules = {
  'absolute-relative': absoluteRelative,
  'import-order': pluginImport.rules!.order,
  'layers-slices': layersSlices,
  'no-cross-segment-reexport': noCrossSegmentReexport,
  'public-api': publicApi,
};

export default rules;
