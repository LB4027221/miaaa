import moment from 'moment';
import * as C from 'handsontable/es/i18n/constants';
import { registerCondition } from './../../conditionRegisterer';

export var CONDITION_NAME = 'date_today';

export function condition(dataRow) {
  var date = moment(dataRow.value, dataRow.meta.dateFormat);

  if (!date.isValid()) {
    return false;
  }

  return date.isSame(moment().startOf('day'), 'd');
}

registerCondition(CONDITION_NAME, condition, {
  name: C.FILTERS_CONDITIONS_TODAY,
  inputsCount: 0
});