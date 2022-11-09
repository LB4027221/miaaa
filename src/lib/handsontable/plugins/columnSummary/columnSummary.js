var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base.js';
import { objectEach } from 'handsontable/es/helpers/object';
import { registerPlugin } from 'handsontable/es/plugins.js';
import Endpoints from './endpoints';

/**
 * @plugin ColumnSummary
 * @pro
 *
 * @description
 * Allows making pre-defined calculations on the cell values and display the results within Handsontable.
 * [See the demo for more information](https://docs.handsontable.com/pro/demo-summary-calculations.html).
 *s
 * @example
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   data: getData(),
 *   colHeaders: true,
 *   rowHeaders: true,
 *   columnSummary: [
 *     {
 *       destinationRow: 4,
 *       destinationColumn: 1,
 *       type: 'min'
 *     },
 *     {
 *       destinationRow: 0,
 *       destinationColumn: 3,
 *       reversedRowCoords: true,
 *       type: 'max'
 *     },
 *     {
 *       destinationRow: 4,
 *       destinationColumn: 5,
 *       type: 'sum',
 *       forceNumeric: true
 *     }
 *   ]
 * });
 */

var ColumnSummary = function (_BasePlugin) {
  _inherits(ColumnSummary, _BasePlugin);

  function ColumnSummary(hotInstance) {
    _classCallCheck(this, ColumnSummary);

    /**
     * The Endpoints class instance. Used to make all endpoint-related operations.
     *
     * @private
     * @type {null|Endpoints}
     */
    var _this = _possibleConstructorReturn(this, (ColumnSummary.__proto__ || Object.getPrototypeOf(ColumnSummary)).call(this, hotInstance));

    _this.endpoints = null;
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link ColumnSummary#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(ColumnSummary, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().columnSummary;
    }

    /**
     * Enables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'enablePlugin',
    value: function enablePlugin() {
      var _this2 = this;

      if (this.enabled) {
        return;
      }

      this.settings = this.hot.getSettings().columnSummary;
      this.endpoints = new Endpoints(this, this.settings);

      this.addHook('afterInit', function () {
        return _this2.onAfterInit.apply(_this2, arguments);
      });
      this.addHook('afterChange', function () {
        return _this2.onAfterChange.apply(_this2, arguments);
      });

      this.addHook('beforeCreateRow', function (index, amount, source) {
        return _this2.endpoints.resetSetupBeforeStructureAlteration('insert_row', index, amount, null, source);
      });
      this.addHook('beforeCreateCol', function (index, amount, source) {
        return _this2.endpoints.resetSetupBeforeStructureAlteration('insert_col', index, amount, null, source);
      });
      this.addHook('beforeRemoveRow', function () {
        var _endpoints;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (_endpoints = _this2.endpoints).resetSetupBeforeStructureAlteration.apply(_endpoints, ['remove_row'].concat(args));
      });
      this.addHook('beforeRemoveCol', function () {
        var _endpoints2;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (_endpoints2 = _this2.endpoints).resetSetupBeforeStructureAlteration.apply(_endpoints2, ['remove_col'].concat(args));
      });
      this.addHook('beforeRowMove', function () {
        return _this2.onBeforeRowMove.apply(_this2, arguments);
      });

      this.addHook('afterCreateRow', function (index, amount, source) {
        return _this2.endpoints.resetSetupAfterStructureAlteration('insert_row', index, amount, null, source);
      });
      this.addHook('afterCreateCol', function (index, amount, source) {
        return _this2.endpoints.resetSetupAfterStructureAlteration('insert_col', index, amount, null, source);
      });
      this.addHook('afterRemoveRow', function () {
        var _endpoints3;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return (_endpoints3 = _this2.endpoints).resetSetupAfterStructureAlteration.apply(_endpoints3, ['remove_row'].concat(args));
      });
      this.addHook('afterRemoveCol', function () {
        var _endpoints4;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return (_endpoints4 = _this2.endpoints).resetSetupAfterStructureAlteration.apply(_endpoints4, ['remove_col'].concat(args));
      });
      this.addHook('afterRowMove', function () {
        return _this2.onAfterRowMove.apply(_this2, arguments);
      });

      _get(ColumnSummary.prototype.__proto__ || Object.getPrototypeOf(ColumnSummary.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.endpoints = null;
      this.settings = null;
      this.currentEndpoint = null;
    }

    /**
     * Calculates math for a single endpoint.
     *
     * @private
     * @param {Object} endpoint Contains information about the endpoint.
     */

  }, {
    key: 'calculate',
    value: function calculate(endpoint) {
      switch (endpoint.type.toLowerCase()) {
        case 'sum':
          endpoint.result = this.calculateSum(endpoint);
          break;
        case 'min':
          endpoint.result = this.calculateMinMax(endpoint, endpoint.type);
          break;
        case 'max':
          endpoint.result = this.calculateMinMax(endpoint, endpoint.type);
          break;
        case 'count':
          endpoint.result = this.countEntries(endpoint);
          break;
        case 'average':
          endpoint.result = this.calculateAverage(endpoint);
          break;
        case 'custom':
          endpoint.result = endpoint.customFunction.call(this, endpoint);
          break;
        default:
          break;
      }
    }

    /**
     * Calculates sum of the values contained in ranges provided in the plugin config.
     *
     * @private
     * @param {Object} endpoint Contains the endpoint information.
     * @returns {Number} Sum for the selected range
     */

  }, {
    key: 'calculateSum',
    value: function calculateSum(endpoint) {
      var _this3 = this;

      var sum = 0;

      objectEach(endpoint.ranges, function (range) {
        sum += _this3.getPartialSum(range, endpoint.sourceColumn);
      });

      return sum;
    }

    /**
     * Returns partial sum of values from a single row range
     *
     * @private
     * @param {Array} rowRange Range for the sum.
     * @param {Number} col Column index.
     * @returns {Number} The partial sum.
     */

  }, {
    key: 'getPartialSum',
    value: function getPartialSum(rowRange, col) {
      var sum = 0;
      var i = rowRange[1] || rowRange[0];
      var cellValue = null;
      var biggestDecimalPlacesCount = 0;

      do {
        cellValue = this.getCellValue(i, col) || 0;
        var decimalPlaces = (('' + cellValue).split('.')[1] || []).length || 1;
        if (decimalPlaces > biggestDecimalPlacesCount) {
          biggestDecimalPlacesCount = decimalPlaces;
        }

        sum += cellValue || 0;
        i -= 1;
      } while (i >= rowRange[0]);

      // Workaround for e.g. 802.2 + 1.1 = 803.3000000000001
      return Math.round(sum * Math.pow(10, biggestDecimalPlacesCount)) / Math.pow(10, biggestDecimalPlacesCount);
    }

    /**
     * Calculates the minimal value for the selected ranges
     *
     * @private
     * @param {Object} endpoint Contains the endpoint information.
     * @param {String} type `'min'` or `'max'`.
     * @returns {Number} Min or Max value.
     */

  }, {
    key: 'calculateMinMax',
    value: function calculateMinMax(endpoint, type) {
      var _this4 = this;

      var result = null;

      objectEach(endpoint.ranges, function (range) {
        var partialResult = _this4.getPartialMinMax(range, endpoint.sourceColumn, type);

        if (result === null && partialResult !== null) {
          result = partialResult;
        }

        if (partialResult !== null) {
          switch (type) {
            case 'min':
              result = Math.min(result, partialResult);
              break;
            case 'max':
              result = Math.max(result, partialResult);
              break;
            default:
              break;
          }
        }
      });

      return result === null ? 'Not enough data' : result;
    }

    /**
     * Returns a local minimum of the provided sub-range
     *
     * @private
     * @param {Array} rowRange Range for the calculation.
     * @param {Number} col Column index.
     * @param {String} type `'min'` or `'max'`
     * @returns {Number} Min or max value.
     */

  }, {
    key: 'getPartialMinMax',
    value: function getPartialMinMax(rowRange, col, type) {
      var result = null;
      var i = rowRange[1] || rowRange[0];
      var cellValue = void 0;

      do {
        cellValue = this.getCellValue(i, col) || null;

        if (result === null) {
          result = cellValue;
        } else if (cellValue !== null) {
          switch (type) {
            case 'min':
              result = Math.min(result, cellValue);
              break;
            case 'max':
              result = Math.max(result, cellValue);
              break;
            default:
              break;
          }
        }

        i -= 1;
      } while (i >= rowRange[0]);

      return result;
    }

    /**
     * Counts empty cells in the provided row range.
     *
     * @private
     * @param {Array} rowRange Row range for the calculation.
     * @param {Number} col Column index.
     * @returns {Number} Empty cells count.
     */

  }, {
    key: 'countEmpty',
    value: function countEmpty(rowRange, col) {
      var cellValue = void 0;
      var counter = 0;
      var i = rowRange[1] || rowRange[0];

      do {
        cellValue = this.getCellValue(i, col);

        if (!cellValue) {
          counter += 1;
        }

        i -= 1;
      } while (i >= rowRange[0]);

      return counter;
    }

    /**
     * Counts non-empty cells in the provided row range.
     *
     * @private
     * @param {Object} endpoint Contains the endpoint information.
     * @returns {Number} Entry count.
     */

  }, {
    key: 'countEntries',
    value: function countEntries(endpoint) {
      var _this5 = this;

      var result = 0;
      var ranges = endpoint.ranges;

      objectEach(ranges, function (range) {
        var partial = range[1] === void 0 ? 1 : range[1] - range[0] + 1;
        var emptyCount = _this5.countEmpty(range, endpoint.sourceColumn);

        result += partial;
        result -= emptyCount;
      });

      return result;
    }

    /**
     * Calculates the average value from the cells in the range.
     *
     * @private
     * @param {Object} endpoint Contains the endpoint information.
     * @returns {Number} Avarage value.
     */

  }, {
    key: 'calculateAverage',
    value: function calculateAverage(endpoint) {
      var sum = this.calculateSum(endpoint);
      var entriesCount = this.countEntries(endpoint);

      return sum / entriesCount;
    }

    /**
     * Returns a cell value, taking into consideration a basic validation.
     *
     * @private
     * @param {Number} row Row index.
     * @param {Number} col Column index.
     * @returns {String} The cell value.
     */

  }, {
    key: 'getCellValue',
    value: function getCellValue(row, col) {
      var visualRowIndex = this.endpoints.getVisualRowIndex(row);
      var visualColumnIndex = this.endpoints.getVisualColumnIndex(col);

      var cellValue = this.hot.getSourceDataAtCell(row, col);
      var cellClassName = this.hot.getCellMeta(visualRowIndex, visualColumnIndex).className || '';

      if (cellClassName.indexOf('columnSummaryResult') > -1) {
        return null;
      }

      if (this.endpoints.currentEndpoint.forceNumeric) {
        if (typeof cellValue === 'string') {
          cellValue = cellValue.replace(/,/, '.');
        }

        cellValue = parseFloat(cellValue);
      }

      if (isNaN(cellValue)) {
        if (!this.endpoints.currentEndpoint.suppressDataTypeErrors) {
          throw new Error('ColumnSummary plugin: cell at (' + row + ', ' + col + ') is not in a numeric format. Cannot do the calculation.');
        }
      }

      return cellValue;
    }

    /**
     * `afterInit` hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterInit',
    value: function onAfterInit() {
      this.endpoints.endpoints = this.endpoints.parseSettings();
      this.endpoints.refreshAllEndpoints(true);
    }

    /**
     * `afterChange` hook callback.
     *
     * @private
     * @param {Array} changes
     * @param {String} source
     */

  }, {
    key: 'onAfterChange',
    value: function onAfterChange(changes, source) {
      if (changes && source !== 'ColumnSummary.reset' && source !== 'ColumnSummary.set' && source !== 'loadData') {
        this.endpoints.refreshChangedEndpoints(changes);
      }
    }

    /**
     * `beforeRowMove` hook callback.
     *
     * @private
     * @param {Array} rows Array of logical rows to be moved.
     */

  }, {
    key: 'onBeforeRowMove',
    value: function onBeforeRowMove(rows) {
      this.endpoints.resetSetupBeforeStructureAlteration('move_row', rows[0], rows.length, rows, this.pluginName);
    }

    /**
     * `afterRowMove` hook callback.
     *
     * @private
     * @param {Array} rows Array of logical rows that were moved.
     * @param {Number} target Index of the destination row.
     */

  }, {
    key: 'onAfterRowMove',
    value: function onAfterRowMove(rows, target) {
      this.endpoints.resetSetupAfterStructureAlteration('move_row', target, rows.length, rows, this.pluginName);
    }
  }]);

  return ColumnSummary;
}(BasePlugin);

registerPlugin('columnSummary', ColumnSummary);

export default ColumnSummary;