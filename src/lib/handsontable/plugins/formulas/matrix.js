var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { arrayEach, arrayFilter, arrayReduce } from 'handsontable/es/helpers/array';
import CellValue from './cell/value';

/**
 * This component is responsible for storing all calculated cells which contain formula expressions (CellValue) and
 * register for all cell references (CellReference).
 *
 * CellValue is an object which represents a formula expression. It contains a calculated value of that formula,
 * an error if applied and cell references. Cell references are CellReference object instances which represent a cell
 * in a spreadsheet. One CellReference can be assigned to multiple CellValues as a precedent cell. Each cell
 * modification triggers a search through CellValues that are dependent of the CellReference. After
 * the match, the cells are marked as 'out of date'. In the next render cycle, all CellValues marked with
 * that state are recalculated.
 *
 * @class Matrix
 * @util
 */

var Matrix = function () {
  function Matrix(recordTranslator) {
    _classCallCheck(this, Matrix);

    /**
     * Record translator for translating visual records into psychical and vice versa.
     *
     * @type {RecordTranslator}
     */
    this.t = recordTranslator;
    /**
     * List of all cell values with theirs precedents.
     *
     * @type {Array}
     */
    this.data = [];
    /**
     * List of all created and registered cell references.
     *
     * @type {Array}
     */
    this.cellReferences = [];
  }

  /**
   * Get cell value at given row and column index.
   *
   * @param {Number} row Physical row index.
   * @param {Number} column Physical column index.
   * @returns {CellValue|null} Returns CellValue instance or `null` if cell not found.
   */


  _createClass(Matrix, [{
    key: 'getCellAt',
    value: function getCellAt(row, column) {
      var result = null;

      arrayEach(this.data, function (cell) {
        if (cell.row === row && cell.column === column) {
          result = cell;

          return false;
        }
      });

      return result;
    }

    /**
     * Get all out of date cells.
     *
     * @returns {Array}
     */

  }, {
    key: 'getOutOfDateCells',
    value: function getOutOfDateCells() {
      return arrayFilter(this.data, function (cell) {
        return cell.isState(CellValue.STATE_OUT_OFF_DATE);
      });
    }

    /**
     * Add cell value to the collection.
     *
     * @param {CellValue|Object} cellValue Cell value object.
     */

  }, {
    key: 'add',
    value: function add(cellValue) {
      if (!arrayFilter(this.data, function (cell) {
        return cell.isEqual(cellValue);
      }).length) {
        this.data.push(cellValue);
      }
    }

    /**
     * Remove cell value from the collection.
     *
     * @param {CellValue|Object|Array} cellValue Cell value object.
     */

  }, {
    key: 'remove',
    value: function remove(cellValue) {
      var isArray = Array.isArray(cellValue);
      var isEqual = function isEqual(cell, values) {
        var result = false;

        if (isArray) {
          arrayEach(values, function (value) {
            if (cell.isEqual(value)) {
              result = true;

              return false;
            }
          });
        } else {
          result = cell.isEqual(values);
        }

        return result;
      };
      this.data = arrayFilter(this.data, function (cell) {
        return !isEqual(cell, cellValue);
      });
    }

    /**
     * Get cell dependencies using visual coordinates.
     *
     * @param {Object} cellCoord Visual cell coordinates object.
     */

  }, {
    key: 'getDependencies',
    value: function getDependencies(cellCoord) {
      var _this = this;

      /* eslint-disable arrow-body-style */
      var getDependencies = function getDependencies(cell) {
        return arrayReduce(_this.data, function (acc, cellValue) {
          if (cellValue.hasPrecedent(cell) && acc.indexOf(cellValue) === -1) {
            acc.push(cellValue);
          }

          return acc;
        }, []);
      };

      var getTotalDependencies = function getTotalDependencies(cell) {
        var deps = getDependencies(cell);

        if (deps.length) {
          arrayEach(deps, function (cellValue) {
            if (cellValue.hasPrecedents()) {
              deps = deps.concat(getTotalDependencies(_this.t.toVisual(cellValue)));
            }
          });
        }

        return deps;
      };

      return getTotalDependencies(cellCoord);
    }

    /**
     * Register cell reference to the collection.
     *
     * @param {CellReference|Object} cellReference Cell reference object.
     */

  }, {
    key: 'registerCellRef',
    value: function registerCellRef(cellReference) {
      if (!arrayFilter(this.cellReferences, function (cell) {
        return cell.isEqual(cellReference);
      }).length) {
        this.cellReferences.push(cellReference);
      }
    }

    /**
     * Remove cell references from the collection.
     *
     * @param {Object} start Start visual coordinate.
     * @param {Object} end End visual coordinate.
     * @returns {Array} Returns removed cell references.
     */

  }, {
    key: 'removeCellRefsAtRange',
    value: function removeCellRefsAtRange(_ref, _ref2) {
      var startRow = _ref.row,
          startColumn = _ref.column;
      var endRow = _ref2.row,
          endColumn = _ref2.column;

      var removed = [];

      var rowMatch = function rowMatch(cell) {
        return startRow === void 0 ? true : cell.row >= startRow && cell.row <= endRow;
      };
      var colMatch = function colMatch(cell) {
        return startColumn === void 0 ? true : cell.column >= startColumn && cell.column <= endColumn;
      };

      this.cellReferences = arrayFilter(this.cellReferences, function (cell) {
        if (rowMatch(cell) && colMatch(cell)) {
          removed.push(cell);

          return false;
        }

        return true;
      });

      return removed;
    }

    /**
     * Reset matrix data.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.data.length = 0;
      this.cellReferences.length = 0;
    }
  }]);

  return Matrix;
}();

export default Matrix;