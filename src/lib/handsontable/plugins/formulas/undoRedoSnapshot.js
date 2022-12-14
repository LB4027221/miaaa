var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { arrayEach } from 'handsontable/es/helpers/array';
import Stack from 'handsontable/es/utils/dataStructures/stack';
import CellValue from './cell/value';

/**
 * This components is a simple workaround to make Undo/Redo functionality work.
 *
 * @class UndoRedoSnapshot
 * @util
 */

var UndoRedoSnapshot = function () {
  function UndoRedoSnapshot(sheet) {
    _classCallCheck(this, UndoRedoSnapshot);

    /**
     * Instance of {@link Sheet}.
     *
     * @type {Sheet}
     */
    this.sheet = sheet;
    /**
     * Stack instance for collecting undo/redo changes.
     *
     * @type {Stack}
     */
    this.stack = new Stack();
  }

  /**
   * Save snapshot for specified action.
   *
   * @param {String} axis Alter action which triggers snapshot.
   * @param {Number} index Alter operation stared at.
   * @param {Number} amount Amount of items to operate.
   */


  _createClass(UndoRedoSnapshot, [{
    key: 'save',
    value: function save(axis, index, amount) {
      var _sheet = this.sheet,
          matrix = _sheet.matrix,
          dataProvider = _sheet.dataProvider;

      var changes = [];

      arrayEach(matrix.data, function (cellValue) {
        var row = cellValue.row,
            column = cellValue.column;


        if (cellValue[axis] < index || cellValue[axis] > index + (amount - 1)) {
          var value = dataProvider.getSourceDataAtCell(row, column);

          changes.push({ row: row, column: column, value: value });
        }
      });

      this.stack.push({ axis: axis, index: index, amount: amount, changes: changes });
    }

    /**
     * Restore state to the previous one.
     */

  }, {
    key: 'restore',
    value: function restore() {
      var _sheet2 = this.sheet,
          matrix = _sheet2.matrix,
          dataProvider = _sheet2.dataProvider;

      var _stack$pop = this.stack.pop(),
          axis = _stack$pop.axis,
          index = _stack$pop.index,
          amount = _stack$pop.amount,
          changes = _stack$pop.changes;

      if (changes) {
        arrayEach(changes, function (change) {
          if (change[axis] > index + (amount - 1)) {
            change[axis] -= amount;
          }
          var row = change.row,
              column = change.column,
              value = change.value;

          var rawValue = dataProvider.getSourceDataAtCell(row, column);

          if (rawValue !== value) {
            dataProvider.updateSourceData(row, column, value);
            matrix.getCellAt(row, column).setState(CellValue.STATE_OUT_OFF_DATE);
          }
        });
      }
    }

    /**
     * Destroy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.sheet = null;
      this.stack = null;
    }
  }]);

  return UndoRedoSnapshot;
}();

export default UndoRedoSnapshot;