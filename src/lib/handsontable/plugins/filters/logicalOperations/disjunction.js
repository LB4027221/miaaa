import * as C from 'handsontable/es/i18n/constants';
import { registerOperation } from '../logicalOperationRegisterer';

export var OPERATION_ID = 'disjunction';
export var SHORT_NAME_FOR_COMPONENT = C.FILTERS_LABELS_DISJUNCTION;
// (p OR q OR w OR x OR...) === TRUE?

export function operationResult(conditions, value) {
  return conditions.some(function (condition) {
    return condition.func(value);
  });
}

registerOperation(OPERATION_ID, SHORT_NAME_FOR_COMPONENT, operationResult);