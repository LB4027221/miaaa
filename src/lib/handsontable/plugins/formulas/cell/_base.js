var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { isObject } from 'handsontable/es/helpers/object';
import { toLabel } from '../formula-parser';

/**
 * @class BaseCell
 * @util
 */

var BaseCell = function () {
  function BaseCell(row, column) {
    _classCallCheck(this, BaseCell);

    var rowObject = isObject(row);
    var columnObject = isObject(column);

    this._row = rowObject ? row.index : row;
    this.rowAbsolute = rowObject ? row.isAbsolute : true;
    this._column = columnObject ? column.index : column;
    this.columnAbsolute = columnObject ? column.isAbsolute : true;
    this.rowOffset = 0;
    this.columnOffset = 0;

    Object.defineProperty(this, 'row', {
      get: function get() {
        return this.rowOffset + this._row;
      },
      set: function set(rowIndex) {
        this._row = rowIndex;
      },

      enumerable: true,
      configurable: true
    });
    Object.defineProperty(this, 'column', {
      get: function get() {
        return this.columnOffset + this._column;
      },
      set: function set(columnIndex) {
        this._column = columnIndex;
      },

      enumerable: true,
      configurable: true
    });
  }

  /**
   * Translate cell coordinates.
   *
   * @param {Number} rowOffset Row offset to move.
   * @param {Number} columnOffset Column offset to move.
   */


  _createClass(BaseCell, [{
    key: 'translateTo',
    value: function translateTo(rowOffset, columnOffset) {
      this.row = this.row + rowOffset;
      this.column = this.column + columnOffset;
    }

    /**
     * Check if cell is equal to provided one.
     *
     * @param {BaseCell} cell Cell object.
     * @returns {Boolean}
     */

  }, {
    key: 'isEqual',
    value: function isEqual(cell) {
      return cell.row === this.row && cell.column === this.column;
    }

    /**
     * Stringify object.
     *
     * @returns {String}
     */

  }, {
    key: 'toString',
    value: function toString() {
      return toLabel({ index: this.row, isAbsolute: this.rowAbsolute }, { index: this.column, isAbsolute: this.columnAbsolute });
    }
  }]);

  return BaseCell;
}();

export default BaseCell;