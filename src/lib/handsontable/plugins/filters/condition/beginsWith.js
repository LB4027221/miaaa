var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import * as C from 'handsontable/es/i18n/constants';
import { stringify } from 'handsontable/es/helpers/mixed';
import { registerCondition } from './../conditionRegisterer';

export var CONDITION_NAME = 'begins_with';

export function condition(dataRow, _ref) {
  var _ref2 = _slicedToArray(_ref, 1),
      value = _ref2[0];

  return stringify(dataRow.value).toLowerCase().startsWith(stringify(value));
}

registerCondition(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_BEGINS_WITH,
  inputsCount: 1,
  showOperators: true
});