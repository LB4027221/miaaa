import { arrayEach } from 'handsontable/es/helpers/array';
import { isFormulaExpression } from './../utils';
import CellValue from './../cell/value';
import ExpressionModifier from './../expressionModifier';

/**
 * When "column_sorting" is triggered the following operations must be performed:
 *
 * - All formulas which contain cell coordinates must be updated and saved into source data - Column must be changed
 *   (decreased or increased) depends on new target position - previous position.
 * - Mark all formulas which need update with "STATE_OUT_OFF_DATE" flag, so they can be recalculated after the operation.
 */
export var OPERATION_NAME = 'column_sorting';

var visualRows = void 0;

/**
 * Collect all previous visual rows from CellValues.
 */
export function prepare() {
  var matrix = this.matrix,
      dataProvider = this.dataProvider;


  visualRows = new WeakMap();

  arrayEach(matrix.data, function (cell) {
    visualRows.set(cell, dataProvider.t.toVisualRow(cell.row));
  });
}

/**
 * Translate all CellValues depends on previous position.
 */
export function operate() {
  var matrix = this.matrix,
      dataProvider = this.dataProvider;


  matrix.cellReferences.length = 0;

  arrayEach(matrix.data, function (cell) {
    cell.setState(CellValue.STATE_OUT_OFF_DATE);
    cell.clearPrecedents();

    var row = cell.row,
        column = cell.column;

    var value = dataProvider.getSourceDataAtCell(row, column);

    if (isFormulaExpression(value)) {
      var prevRow = visualRows.get(cell);
      var expModifier = new ExpressionModifier(value);

      expModifier.translate({ row: dataProvider.t.toVisualRow(row) - prevRow });

      dataProvider.updateSourceData(row, column, expModifier.toString());
    }
  });

  visualRows = null;
}