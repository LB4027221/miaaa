import * as C from 'handsontable/es/i18n/constants';
import { registerOperation } from '../logicalOperationRegisterer';

export var OPERATION_ID = 'conjunction';
export var SHORT_NAME_FOR_COMPONENT = C.FILTERS_LABELS_CONJUNCTION;
// p AND q AND w AND x AND... === TRUE?

export function operationResult(conditions, value) {
  return conditions.every(function (condition) {
    return condition.func(value);
  });
}

registerOperation(OPERATION_ID, SHORT_NAME_FOR_COMPONENT, operationResult);