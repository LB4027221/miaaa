import { arrayEach } from 'handsontable/es/helpers/array';
import { cellCoordFactory, isFormulaExpression } from './../utils';
import CellValue from './../cell/value';
import ExpressionModifier from './../expressionModifier';

/**
 * When "insert_row" is triggered the following operations must be performed:
 *
 * - All formulas which contain cell coordinates must be updated and saved into source data - Row must be increased
 *   by "amount" of times (eq: D4 to D5, $F$5 to $F$6);
 * - Mark all formulas which need update with "STATE_OUT_OFF_DATE" flag, so they can be recalculated after the operation.
 */
export var OPERATION_NAME = 'insert_row';

/**
 * Execute changes.
 *
 * @param {Number} start Index row from which the operation starts.
 * @param {Number} amount Count of rows to be inserted.
 * @param {Boolean} [modifyFormula=true] If `true` all formula expressions will be modified according to the changes.
 *                                       `false` value is used by UndoRedo plugin which saves snapshoots before alter
 *                                       operation so it doesn't modify formulas if undo action is triggered.
 */
export function operate(start, amount) {
  var modifyFormula = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var matrix = this.matrix,
      dataProvider = this.dataProvider;

  var translate = [amount, 0];

  arrayEach(matrix.cellReferences, function (cell) {
    if (cell.row >= start) {
      cell.translateTo.apply(cell, translate);
    }
  });

  arrayEach(matrix.data, function (cell) {
    var origRow = cell.row,
        origColumn = cell.column;


    if (cell.row >= start) {
      cell.translateTo.apply(cell, translate);
      cell.setState(CellValue.STATE_OUT_OFF_DATE);
    }

    if (modifyFormula) {
      var row = cell.row,
          column = cell.column;

      var value = dataProvider.getSourceDataAtCell(row, column);

      if (isFormulaExpression(value)) {
        var startCoord = cellCoordFactory('row', start);
        var expModifier = new ExpressionModifier(value);

        expModifier.useCustomModifier(customTranslateModifier);
        expModifier.translate({ row: amount }, startCoord({ row: origRow, column: origColumn }));

        dataProvider.updateSourceData(row, column, expModifier.toString());
      }
    }
  });
}

function customTranslateModifier(cell, axis, delta, startFromIndex) {
  var start = cell.start,
      end = cell.end;

  var startIndex = start[axis].index;
  var endIndex = end[axis].index;
  var deltaStart = delta;
  var deltaEnd = delta;

  // Do not translate cells above inserted row or on the left of inserted column
  if (startFromIndex > startIndex) {
    deltaStart = 0;
  }
  if (startFromIndex > endIndex) {
    deltaEnd = 0;
  }

  return [deltaStart, deltaEnd, false];
}