var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { arrayEach } from 'handsontable/es/helpers/array';
import { rangeEach } from 'handsontable/es/helpers/number';
import { hasOwnProperty } from 'handsontable/es/helpers/object';
import { getTranslator } from 'handsontable/es/utils/recordTranslator';

/**
 * Data class provider responsible for providing a set of range data types, necessary for calculating formulas.
 * Those methods strongly using hot.getData and hot.getSourceData methods with some changes. Data provider additionally
 * collects all changes added to the data source to make them available faster than by using
 * hot.getData and hot.getSourceData methods.
 *
 * @class DataProvider
 * @util
 */

var DataProvider = function () {
  function DataProvider(hot) {
    _classCallCheck(this, DataProvider);

    /**
     * Handsontable instance.
     *
     * @type {Core}
     */
    this.hot = hot;
    /**
     * Collected changes applied into editors or by calling public Handsontable API. This is require to provide
     * fresh data applied into spreadsheet before they will be available from the public API.
     *
     * @type {Object}
     */
    this.changes = {};
    /**
     * Record translator for translating visual records into psychical and vice versa.
     *
     * @type {RecordTranslator}
     */
    this.t = getTranslator(this.hot);
  }

  /**
   * Collect all data changes applied to the Handsontable to make them available later.
   *
   * @param {Number} row Physical row index.
   * @param {Number} column Physical column index.
   * @param {*} value Value to store.
   */


  _createClass(DataProvider, [{
    key: 'collectChanges',
    value: function collectChanges(row, column, value) {
      this.changes[this._coordId(row, column)] = value;
    }

    /**
     * Clear all collected changes.
     */

  }, {
    key: 'clearChanges',
    value: function clearChanges() {
      this.changes = {};
    }

    /**
     * Check if provided coordinates match to the table range data.
     *
     * @param {Number} visualRow Visual row index.
     * @param {Number} visualColumn Visual row index.
     * @returns {Boolean}
     */

  }, {
    key: 'isInDataRange',
    value: function isInDataRange(visualRow, visualColumn) {
      return visualRow >= 0 && visualRow < this.hot.countRows() && visualColumn >= 0 && visualColumn < this.hot.countCols();
    }

    /**
     * Get calculated data at specified cell.
     *
     * @param {Number} visualRow Visual row index.
     * @param {Number} visualColumn Visual column index.
     * @returns {*}
     */

  }, {
    key: 'getDataAtCell',
    value: function getDataAtCell(visualRow, visualColumn) {
      var id = this._coordId.apply(this, _toConsumableArray(this.t.toPhysical(visualRow, visualColumn)));
      var result = void 0;

      if (hasOwnProperty(this.changes, id)) {
        result = this.changes[id];
      } else {
        result = this.hot.getDataAtCell(visualRow, visualColumn);
      }

      return result;
    }

    /**
     * Get calculated data at specified range.
     *
     * @param {Number} [visualRow1] Visual row index.
     * @param {Number} [visualColumn1] Visual column index.
     * @param {Number} [visualRow2] Visual row index.
     * @param {Number} [visualColumn2] Visual column index.
     * @returns {Array}
     */

  }, {
    key: 'getDataByRange',
    value: function getDataByRange(visualRow1, visualColumn1, visualRow2, visualColumn2) {
      var _this = this;

      var result = this.hot.getData(visualRow1, visualColumn1, visualRow2, visualColumn2);

      arrayEach(result, function (rowData, rowIndex) {
        arrayEach(rowData, function (value, columnIndex) {
          var id = _this._coordId.apply(_this, _toConsumableArray(_this.t.toPhysical(rowIndex + visualRow1, columnIndex + visualColumn1)));

          if (hasOwnProperty(_this.changes, id)) {
            result[rowIndex][columnIndex] = _this.changes[id];
          }
        });
      });

      return result;
    }

    /**
     * Get source data at specified physical cell.
     *
     * @param {Number} physicalRow Physical row index.
     * @param {Number} physicalColumn Physical column index.
     * @returns {*}
     */

  }, {
    key: 'getSourceDataAtCell',
    value: function getSourceDataAtCell(physicalRow, physicalColumn) {
      var id = this._coordId(physicalRow, physicalColumn);
      var result = void 0;

      if (hasOwnProperty(this.changes, id)) {
        result = this.changes[id];
      } else {
        result = this.hot.getSourceDataAtCell(physicalRow, physicalColumn);
      }

      return result;
    }

    /**
     * Get source data at specified physical range.
     *
     * @param {Number} [physicalRow1] Physical row index.
     * @param {Number} [physicalColumn1] Physical column index.
     * @param {Number} [physicalRow2] Physical row index.
     * @param {Number} [physicalColumn2] Physical column index.
     * @returns {Array}
     */

  }, {
    key: 'getSourceDataByRange',
    value: function getSourceDataByRange(physicalRow1, physicalColumn1, physicalRow2, physicalColumn2) {
      return this.hot.getSourceDataArray(physicalRow1, physicalColumn1, physicalRow2, physicalColumn2);
    }

    /**
     * Get source data at specified visual cell.
     *
     * @param {Number} visualRow Visual row index.
     * @param {Number} visualColumn Visual column index.
     * @returns {*}
     */

  }, {
    key: 'getRawDataAtCell',
    value: function getRawDataAtCell(visualRow, visualColumn) {
      return this.getSourceDataAtCell.apply(this, _toConsumableArray(this.t.toPhysical(visualRow, visualColumn)));
    }

    /**
     * Get source data at specified visual range.
     *
     * @param {Number} [visualRow1] Visual row index.
     * @param {Number} [visualColumn1] Visual column index.
     * @param {Number} [visualRow2] Visual row index.
     * @param {Number} [visualColumn2] Visual column index.
     * @returns {Array}
     */

  }, {
    key: 'getRawDataByRange',
    value: function getRawDataByRange(visualRow1, visualColumn1, visualRow2, visualColumn2) {
      var _this2 = this;

      var data = [];

      rangeEach(visualRow1, visualRow2, function (visualRow) {
        var row = [];

        rangeEach(visualColumn1, visualColumn2, function (visualColumn) {
          var _t$toPhysical = _this2.t.toPhysical(visualRow, visualColumn),
              _t$toPhysical2 = _slicedToArray(_t$toPhysical, 2),
              physicalRow = _t$toPhysical2[0],
              physicalColumn = _t$toPhysical2[1];

          var id = _this2._coordId(physicalRow, physicalColumn);

          if (hasOwnProperty(_this2.changes, id)) {
            row.push(_this2.changes[id]);
          } else {
            row.push(_this2.getSourceDataAtCell(physicalRow, physicalColumn));
          }
        });

        data.push(row);
      });

      return data;
    }

    /**
     * Update source data.
     *
     * @param {Number} physicalRow Physical row index.
     * @param {Number} physicalColumn Physical row index.
     * @param {*} value Value to update.
     */

  }, {
    key: 'updateSourceData',
    value: function updateSourceData(physicalRow, physicalColumn, value) {
      this.hot.getSourceData()[physicalRow][this.hot.colToProp(physicalColumn)] = value;
    }

    /**
     * Generate cell coordinates id where the data changes will be stored.
     *
     * @param {Number} row Row index.
     * @param {Number} column Column index.
     * @returns {String}
     * @private
     */

  }, {
    key: '_coordId',
    value: function _coordId(row, column) {
      return row + ':' + column;
    }

    /**
     * Destroy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.hot = null;
      this.changes = null;
      this.t = null;
    }
  }]);

  return DataProvider;
}();

export default DataProvider;