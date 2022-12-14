import * as C from 'handsontable/es/i18n/constants';
import { registerCondition, getCondition } from './../conditionRegisterer';
import { CONDITION_NAME as CONDITION_BETWEEN } from './between';

export var CONDITION_NAME = 'not_between';

export function condition(dataRow, inputValues) {
  return !getCondition(CONDITION_BETWEEN, inputValues)(dataRow);
}

registerCondition(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_NOT_BETWEEN,
  inputsCount: 2,
  showOperators: true
});