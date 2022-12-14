var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { rangeEach } from 'handsontable/es/helpers/number';

// Waiting for jshint >=2.9.0 where they added support for destructing
// jshint ignore: start

/**
 * @plugin ExportFile
 * @private
 */

var DataProvider = function () {
  function DataProvider(hotInstance) {
    _classCallCheck(this, DataProvider);

    /**
     * Handsontable instance.
     *
     * @type {Core}
     */
    this.hot = hotInstance;
    /**
     * Format type class options.
     *
     * @type {Object}
     */
    this.options = {};
  }

  /**
   * Set options for data provider.
   *
   * @param {Object} options Object with specified options.
   */


  _createClass(DataProvider, [{
    key: 'setOptions',
    value: function setOptions(options) {
      this.options = options;
    }

    /**
     * Get table data based on provided settings to the class constructor.
     *
     * @returns {Array}
     */

  }, {
    key: 'getData',
    value: function getData() {
      var _this = this;

      var _getDataRange2 = this._getDataRange(),
          startRow = _getDataRange2.startRow,
          startCol = _getDataRange2.startCol,
          endRow = _getDataRange2.endRow,
          endCol = _getDataRange2.endCol;

      var options = this.options;
      var data = [];

      rangeEach(startRow, endRow, function (rowIndex) {
        var row = [];

        if (!options.exportHiddenRows && _this._isHiddenRow(rowIndex)) {
          return;
        }
        rangeEach(startCol, endCol, function (colIndex) {
          if (!options.exportHiddenColumns && _this._isHiddenColumn(colIndex)) {
            return;
          }
          row.push(_this.hot.getDataAtCell(rowIndex, colIndex));
        });

        data.push(row);
      });

      return data;
    }

    /**
     * Gets list of row headers.
     *
     * @return {Array}
     */

  }, {
    key: 'getRowHeaders',
    value: function getRowHeaders() {
      var _this2 = this;

      var headers = [];

      if (this.options.rowHeaders) {
        var _getDataRange3 = this._getDataRange(),
            startRow = _getDataRange3.startRow,
            endRow = _getDataRange3.endRow;

        var rowHeaders = this.hot.getRowHeader();

        rangeEach(startRow, endRow, function (row) {
          if (!_this2.options.exportHiddenRows && _this2._isHiddenRow(row)) {
            return;
          }
          headers.push(rowHeaders[row]);
        });
      }

      return headers;
    }

    /**
     * Gets list of columns headers.
     *
     * @return {Array}
     */

  }, {
    key: 'getColumnHeaders',
    value: function getColumnHeaders() {
      var _this3 = this;

      var headers = [];

      if (this.options.columnHeaders) {
        var _getDataRange4 = this._getDataRange(),
            startCol = _getDataRange4.startCol,
            endCol = _getDataRange4.endCol;

        var colHeaders = this.hot.getColHeader();

        rangeEach(startCol, endCol, function (column) {
          if (!_this3.options.exportHiddenColumns && _this3._isHiddenColumn(column)) {
            return;
          }
          headers.push(colHeaders[column]);
        });
      }

      return headers;
    }

    /**
     * Get data range object based on settings provided in the class constructor.
     *
     * @private
     * @returns {Object} Returns object with keys `startRow`, `startCol`, `endRow` and `endCol`.
     */

  }, {
    key: '_getDataRange',
    value: function _getDataRange() {
      var cols = this.hot.countCols() - 1;
      var rows = this.hot.countRows() - 1;

      var _options$range = _slicedToArray(this.options.range, 4),
          _options$range$ = _options$range[0],
          startRow = _options$range$ === undefined ? 0 : _options$range$,
          _options$range$2 = _options$range[1],
          startCol = _options$range$2 === undefined ? 0 : _options$range$2,
          _options$range$3 = _options$range[2],
          endRow = _options$range$3 === undefined ? rows : _options$range$3,
          _options$range$4 = _options$range[3],
          endCol = _options$range$4 === undefined ? cols : _options$range$4;

      startRow = Math.max(startRow, 0);
      startCol = Math.max(startCol, 0);
      endRow = Math.min(endRow, rows);
      endCol = Math.min(endCol, cols);

      return { startRow: startRow, startCol: startCol, endRow: endRow, endCol: endCol };
    }

    /**
     * Check if row at specified row index is hidden.
     *
     * @private
     * @param {Number} row Row index.
     * @returns {Boolean}
     */

  }, {
    key: '_isHiddenRow',
    value: function _isHiddenRow(row) {
      return this.hot.hasHook('hiddenRow') && this.hot.runHooks('hiddenRow', row);
    }

    /**
     * Check if column at specified column index is hidden.
     *
     * @private
     * @param {Number} column Column index.
     * @returns {Boolean}
     */

  }, {
    key: '_isHiddenColumn',
    value: function _isHiddenColumn(column) {
      return this.hot.hasHook('hiddenColumn') && this.hot.runHooks('hiddenColumn', column);
    }
  }]);

  return DataProvider;
}();

export default DataProvider;