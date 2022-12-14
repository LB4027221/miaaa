import * as C from 'handsontable/es/i18n/constants';
import { registerCondition } from './../conditionRegisterer';

export var CONDITION_NAME = 'none';

export function condition() {
  return true;
}

registerCondition(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_NONE,
  inputsCount: 0,
  showOperators: false
});