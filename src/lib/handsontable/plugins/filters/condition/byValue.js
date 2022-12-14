var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { registerCondition } from './../conditionRegisterer';
import { createArrayAssertion } from './../utils';

export var CONDITION_NAME = 'by_value';

export function condition(dataRow, _ref) {
  var _ref2 = _slicedToArray(_ref, 1),
      value = _ref2[0];

  return value(dataRow.value);
}

registerCondition(CONDITION_NAME, condition, {
  name: 'By value',
  inputsCount: 0,
  inputValuesDecorator: function inputValuesDecorator(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        data = _ref4[0];

    return [createArrayAssertion(data)];
  },

  showOperators: false
});