import * as C from 'handsontable/es/i18n/constants';
import { registerCondition } from './../conditionRegisterer';

export var CONDITION_NAME = 'empty';

export function condition(dataRow) {
  return dataRow.value === '' || dataRow.value === null || dataRow.value === void 0;
}

registerCondition(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_EMPTY,
  inputsCount: 0,
  showOperators: true
});