var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import moment from 'moment';
import * as C from 'handsontable/es/i18n/constants';
import { registerCondition } from './../../conditionRegisterer';

export var CONDITION_NAME = 'date_after';

export function condition(dataRow, _ref) {
  var _ref2 = _slicedToArray(_ref, 1),
      value = _ref2[0];

  var date = moment(dataRow.value, dataRow.meta.dateFormat);
  var inputDate = moment(value, dataRow.meta.dateFormat);

  if (!date.isValid() || !inputDate.isValid()) {
    return false;
  }

  return date.diff(inputDate) >= 0;
}

registerCondition(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_AFTER,
  inputsCount: 1,
  showOperators: true
});