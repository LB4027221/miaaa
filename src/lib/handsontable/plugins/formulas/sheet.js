var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Parser, ERROR_REF, error as isFormulaError } from './formula-parser';
import { arrayEach, arrayMap } from 'handsontable/es/helpers/array';
import localHooks from 'handsontable/es/mixins/localHooks';
import { getTranslator } from 'handsontable/es/utils/recordTranslator';
import { mixin } from 'handsontable/es/helpers/object';
import CellValue from './cell/value';
import CellReference from './cell/reference';
import { isFormulaExpression, toUpperCaseFormula } from './utils';
import Matrix from './matrix';
import AlterManager from './alterManager';


var STATE_UP_TO_DATE = 1;
var STATE_NEED_REBUILD = 2;
var STATE_NEED_FULL_REBUILD = 3;

/**
 * Sheet component responsible for whole spreadsheet calculations.
 *
 * @class Sheet
 * @util
 */

var Sheet = function () {
  function Sheet(hot, dataProvider) {
    var _this = this;

    _classCallCheck(this, Sheet);

    /**
     * Handsontable instance.
     *
     * @type {Core}
     */
    this.hot = hot;
    /**
     * Record translator for translating visual records into psychical and vice versa.
     *
     * @type {RecordTranslator}
     */
    this.t = getTranslator(this.hot);
    /**
     * Data provider for sheet calculations.
     *
     * @type {DataProvider}
     */
    this.dataProvider = dataProvider;
    /**
     * Instance of {@link https://github.com/handsontable/formula-parser}.
     *
     * @type {Parser}
     */
    this.parser = new Parser();
    /**
     * Instance of {@link Matrix}.
     *
     * @type {Matrix}
     */
    this.matrix = new Matrix(this.t);
    /**
     * Instance of {@link AlterManager}.
     *
     * @type {AlterManager}
     */
    this.alterManager = new AlterManager(this);
    /**
     * Cell object which indicates which cell is currently processing.
     *
     * @private
     * @type {null}
     */
    this._processingCell = null;
    /**
     * State of the sheet.
     *
     * @type {Number}
     * @private
     */
    this._state = STATE_NEED_FULL_REBUILD;

    this.parser.on('callCellValue', function () {
      return _this._onCallCellValue.apply(_this, arguments);
    });
    this.parser.on('callRangeValue', function () {
      return _this._onCallRangeValue.apply(_this, arguments);
    });
    this.alterManager.addLocalHook('afterAlter', function () {
      return _this._onAfterAlter.apply(_this, arguments);
    });
  }

  /**
   * Recalculate sheet.
   */


  _createClass(Sheet, [{
    key: 'recalculate',
    value: function recalculate() {
      switch (this._state) {
        case STATE_NEED_FULL_REBUILD:
          this.recalculateFull();
          break;
        case STATE_NEED_REBUILD:
          this.recalculateOptimized();
          break;
        default:
          break;
      }
    }

    /**
     * Recalculate sheet using optimized methods (fast recalculation).
     */

  }, {
    key: 'recalculateOptimized',
    value: function recalculateOptimized() {
      var _this2 = this;

      var cells = this.matrix.getOutOfDateCells();

      arrayEach(cells, function (cellValue) {
        var value = _this2.dataProvider.getSourceDataAtCell(cellValue.row, cellValue.column);

        if (isFormulaExpression(value)) {
          _this2.parseExpression(cellValue, value.substr(1));
        }
      });

      this._state = STATE_UP_TO_DATE;
      this.runLocalHooks('afterRecalculate', cells, 'optimized');
    }

    /**
     * Recalculate whole table by building dependencies from scratch (slow recalculation).
     */

  }, {
    key: 'recalculateFull',
    value: function recalculateFull() {
      var _this3 = this;

      var cells = this.dataProvider.getSourceDataByRange();

      this.matrix.reset();

      arrayEach(cells, function (rowData, row) {
        arrayEach(rowData, function (value, column) {
          if (isFormulaExpression(value)) {
            _this3.parseExpression(new CellValue(row, column), value.substr(1));
          }
        });
      });

      this._state = STATE_UP_TO_DATE;
      this.runLocalHooks('afterRecalculate', cells, 'full');
    }

    /**
     * Set predefined variable name which can be visible while parsing formula expression.
     *
     * @param {String} name Variable name.
     * @param {*} value Variable value.
     */

  }, {
    key: 'setVariable',
    value: function setVariable(name, value) {
      this.parser.setVariable(name, value);
    }

    /**
     * Get variable name.
     *
     * @param {String} name Variable name.
     * @returns {*}
     */

  }, {
    key: 'getVariable',
    value: function getVariable(name) {
      return this.parser.getVariable(name);
    }

    /**
     * Apply changes to the sheet.
     *
     * @param {Number} row Physical row index.
     * @param {Number} column Physical column index.
     * @param {*} newValue Current cell value.
     */

  }, {
    key: 'applyChanges',
    value: function applyChanges(row, column, newValue) {
      // Remove formula description for old expression
      this.matrix.remove({ row: row, column: column });

      if (isFormulaExpression(newValue)) {
        // ...and create new for new changed formula expression
        this.parseExpression(new CellValue(row, column), newValue.substr(1));
      }

      var deps = this.getCellDependencies.apply(this, _toConsumableArray(this.t.toVisual(row, column)));

      arrayEach(deps, function (cellValue) {
        cellValue.setState(CellValue.STATE_OUT_OFF_DATE);
      });

      this._state = STATE_NEED_REBUILD;
    }

    /**
     * Parse and evaluate formula for provided cell.
     *
     * @param {CellValue|Object} cellValue Cell value object.
     * @param {String} formula Value to evaluate.
     */

  }, {
    key: 'parseExpression',
    value: function parseExpression(cellValue, formula) {
      cellValue.setState(CellValue.STATE_COMPUTING);
      this._processingCell = cellValue;

      var _parser$parse = this.parser.parse(toUpperCaseFormula(formula)),
          error = _parser$parse.error,
          result = _parser$parse.result;

      if (isFormulaExpression(result)) {
        this.parseExpression(cellValue, result.substr(1));
      } else {
        cellValue.setValue(result);
        cellValue.setError(error);
        cellValue.setState(CellValue.STATE_UP_TO_DATE);
      }

      this.matrix.add(cellValue);
      this._processingCell = null;
    }

    /**
     * Get cell value object at specified physical coordinates.
     *
     * @param {Number} row Physical row index.
     * @param {Number} column Physical column index.
     * @returns {CellValue|undefined}
     */

  }, {
    key: 'getCellAt',
    value: function getCellAt(row, column) {
      return this.matrix.getCellAt(row, column);
    }

    /**
     * Get cell dependencies at specified physical coordinates.
     *
     * @param {Number} row Physical row index.
     * @param {Number} column Physical column index.
     * @returns {Array}
     */

  }, {
    key: 'getCellDependencies',
    value: function getCellDependencies(row, column) {
      return this.matrix.getDependencies({ row: row, column: column });
    }

    /**
     * Listener for parser cell value.
     *
     * @private
     * @param {Object} cellCoords Cell coordinates.
     * @param {Function} done Function to call with valid cell value.
     */

  }, {
    key: '_onCallCellValue',
    value: function _onCallCellValue(_ref, done) {
      console.log(_ref)
      var row = _ref.row,
          column = _ref.column;

      var cell = new CellReference(row, column);
      if (!this.dataProvider.isInDataRange(cell.row, cell.column)) {
        throw Error(ERROR_REF);
      }

      this.matrix.registerCellRef(cell);
      this._processingCell.addPrecedent(cell);

      var cellValue = this.dataProvider.getRawDataAtCell(row.index, column.index);

      if (isFormulaError(cellValue)) {
        var computedCell = this.matrix.getCellAt(row.index, column.index);

        if (computedCell && computedCell.hasError()) {
          throw Error(cellValue);
        }
      }

      if (isFormulaExpression(cellValue)) {
        var _parser$parse2 = this.parser.parse(cellValue.substr(1)),
            error = _parser$parse2.error,
            result = _parser$parse2.result;

        if (error) {
          throw Error(error);
        }
        done(result);
      } else {
        done(cellValue);
      }
    }

    /**
     * Listener for parser cells (range) value.
     *
     * @private
     * @param {Object} startCell Cell coordinates (top-left corner coordinate).
     * @param {Object} endCell Cell coordinates (bottom-right corner coordinate).
     * @param {Function} done Function to call with valid cells values.
     */

  }, {
    key: '_onCallRangeValue',
    value: function _onCallRangeValue(_ref2, _ref3, done) {
      console.log(_ref2, _ref3)
      var startRow = _ref2.row,
          startColumn = _ref2.column;

      var _this4 = this;

      var endRow = _ref3.row,
          endColumn = _ref3.column;

      var cellValues = this.dataProvider.getRawDataByRange(startRow.index, startColumn.index, endRow.index, endColumn.index);

      var mapRowData = function mapRowData(rowData, rowIndex) {
        return arrayMap(rowData, function (cellData, columnIndex) {
          var rowCellCoord = startRow.index + rowIndex;
          var columnCellCoord = startColumn.index + columnIndex;
          var cell = new CellReference(rowCellCoord, columnCellCoord);

          if (!_this4.dataProvider.isInDataRange(cell.row, cell.column)) {
            throw Error(ERROR_REF);
          }

          _this4.matrix.registerCellRef(cell);
          _this4._processingCell.addPrecedent(cell);

          var newCellData = cellData;

          if (isFormulaError(newCellData)) {
            var computedCell = _this4.matrix.getCellAt(cell.row, cell.column);

            if (computedCell && computedCell.hasError()) {
              throw Error(newCellData);
            }
          }

          if (isFormulaExpression(newCellData)) {
            var _parser$parse3 = _this4.parser.parse(newCellData.substr(1)),
                error = _parser$parse3.error,
                result = _parser$parse3.result;

            if (error) {
              throw Error(error);
            }

            newCellData = result;
          }

          return newCellData;
        });
      };

      var calculatedCellValues = arrayMap(cellValues, function (rowData, rowIndex) {
        return mapRowData(rowData, rowIndex);
      });

      done(calculatedCellValues);
    }

    /**
     * On after alter sheet listener.
     *
     * @private
     */

  }, {
    key: '_onAfterAlter',
    value: function _onAfterAlter() {
      this.recalculateOptimized();
    }

    /**
     * Destroy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.hot = null;
      this.t = null;
      this.dataProvider.destroy();
      this.dataProvider = null;
      this.alterManager.destroy();
      this.alterManager = null;
      this.parser = null;
      this.matrix.reset();
      this.matrix = null;
    }
  }]);

  return Sheet;
}();

mixin(Sheet, localHooks);

export default Sheet;