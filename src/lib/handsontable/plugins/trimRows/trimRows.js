var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base';
import { arrayEach } from 'handsontable/es/helpers/array';
import { rangeEach } from 'handsontable/es/helpers/number';
import { registerPlugin } from 'handsontable/es/plugins';
import RowsMapper from './rowsMapper';

/**
 * @plugin TrimRows
 * @pro
 *
 * @description
 * The plugin allows to trim certain rows. The trimming is achieved by applying the transformation algorithm to the data
 * transformation. In this case, when the row is trimmed it is not accessible using `getData*` methods thus the trimmed
 * data is not visible to other plugins.
 *
 * @example
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   date: getData(),
 *   // hide selected rows on table initialization
 *   trimRows: [1, 2, 5]
 * });
 *
 * // access the trimRows plugin instance
 * const trimRowsPlugin = hot.getPlugin('trimRows');
 *
 * // hide single row
 * trimRowsPlugin.trimRow(1);
 *
 * // hide multiple rows
 * trimRowsPlugin.trimRow(1, 2, 9);
 *
 * // or as an array
 * trimRowsPlugin.trimRows([1, 2, 9]);
 *
 * // show single row
 * trimRowsPlugin.untrimRow(1);
 *
 * // show multiple rows
 * trimRowsPlugin.untrimRow(1, 2, 9);
 *
 * // or as an array
 * trimRowsPlugin.untrimRows([1, 2, 9]);
 *
 * // rerender table to see the changes
 * hot.render();
 * ```
 */

var TrimRows = function (_BasePlugin) {
  _inherits(TrimRows, _BasePlugin);

  function TrimRows(hotInstance) {
    _classCallCheck(this, TrimRows);

    /**
     * List of trimmed row indexes.
     *
     * @private
     * @type {Array}
     */
    var _this = _possibleConstructorReturn(this, (TrimRows.__proto__ || Object.getPrototypeOf(TrimRows)).call(this, hotInstance));

    _this.trimmedRows = [];
    /**
     * List of last removed row indexes.
     *
     * @private
     * @type {Array}
     */
    _this.removedRows = [];
    /**
     * Object containing visual row indexes mapped to data source indexes.
     *
     * @private
     * @type {RowsMapper}
     */
    _this.rowsMapper = new RowsMapper(_this);
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link AutoRowSize#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(TrimRows, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().trimRows;
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
      var settings = this.hot.getSettings().trimRows;

      if (Array.isArray(settings)) {
        this.trimmedRows = settings;
      }
      this.rowsMapper.createMap(this.hot.countSourceRows());

      this.addHook('modifyRow', function (row, source) {
        return _this2.onModifyRow(row, source);
      });
      this.addHook('unmodifyRow', function (row, source) {
        return _this2.onUnmodifyRow(row, source);
      });
      this.addHook('beforeCreateRow', function (index, amount, source) {
        return _this2.onBeforeCreateRow(index, amount, source);
      });
      this.addHook('afterCreateRow', function (index, amount) {
        return _this2.onAfterCreateRow(index, amount);
      });
      this.addHook('beforeRemoveRow', function (index, amount) {
        return _this2.onBeforeRemoveRow(index, amount);
      });
      this.addHook('afterRemoveRow', function () {
        return _this2.onAfterRemoveRow();
      });
      this.addHook('afterLoadData', function (firstRun) {
        return _this2.onAfterLoadData(firstRun);
      });

      _get(TrimRows.prototype.__proto__ || Object.getPrototypeOf(TrimRows.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: 'updatePlugin',
    value: function updatePlugin() {
      var settings = this.hot.getSettings().trimRows;

      if (Array.isArray(settings)) {
        this.disablePlugin();
        this.enablePlugin();
      }

      _get(TrimRows.prototype.__proto__ || Object.getPrototypeOf(TrimRows.prototype), 'updatePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.trimmedRows = [];
      this.removedRows.length = 0;
      this.rowsMapper.clearMap();
      _get(TrimRows.prototype.__proto__ || Object.getPrototypeOf(TrimRows.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Trims the rows provided in the array.
     *
     * @param {Number[]} rows Array of physical row indexes.
     * @fires Hooks#skipLengthCache
     * @fires Hooks#afterTrimRow
     */

  }, {
    key: 'trimRows',
    value: function trimRows(rows) {
      var _this3 = this;

      arrayEach(rows, function (row) {
        var physicalRow = parseInt(row, 10);

        if (!_this3.isTrimmed(physicalRow)) {
          _this3.trimmedRows.push(physicalRow);
        }
      });

      this.hot.runHooks('skipLengthCache', 100);
      this.rowsMapper.createMap(this.hot.countSourceRows());
      this.hot.runHooks('afterTrimRow', rows);
    }

    /**
     * Trims the row provided as physical row index (counting from 0).
     *
     * @param {...Number} row Physical row index.
     */

  }, {
    key: 'trimRow',
    value: function trimRow() {
      for (var _len = arguments.length, row = Array(_len), _key = 0; _key < _len; _key++) {
        row[_key] = arguments[_key];
      }

      this.trimRows(row);
    }

    /**
     * Untrims the rows provided in the array.
     *
     * @param {Number[]} rows Array of physical row indexes.
     * @fires Hooks#skipLengthCache
     * @fires Hooks#afterUntrimRow
     */

  }, {
    key: 'untrimRows',
    value: function untrimRows(rows) {
      var _this4 = this;

      arrayEach(rows, function (row) {
        var physicalRow = parseInt(row, 10);

        if (_this4.isTrimmed(physicalRow)) {
          _this4.trimmedRows.splice(_this4.trimmedRows.indexOf(physicalRow), 1);
        }
      });

      this.hot.runHooks('skipLengthCache', 100);
      this.rowsMapper.createMap(this.hot.countSourceRows());
      this.hot.runHooks('afterUntrimRow', rows);
    }

    /**
     * Untrims the row provided as row index (counting from 0).
     *
     * @param {...Number} row Physical row index.
     */

  }, {
    key: 'untrimRow',
    value: function untrimRow() {
      for (var _len2 = arguments.length, row = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        row[_key2] = arguments[_key2];
      }

      this.untrimRows(row);
    }

    /**
     * Checks if given physical row is hidden.
     *
     * @returns {Boolean}
     */

  }, {
    key: 'isTrimmed',
    value: function isTrimmed(row) {
      return this.trimmedRows.indexOf(row) > -1;
    }

    /**
     * Untrims all trimmed rows.
     */

  }, {
    key: 'untrimAll',
    value: function untrimAll() {
      this.untrimRows([].concat(this.trimmedRows));
    }

    /**
     * On modify row listener.
     *
     * @private
     * @param {Number} row Visual row index.
     * @param {String} source Source name.
     * @returns {Number|null}
     */

  }, {
    key: 'onModifyRow',
    value: function onModifyRow(row, source) {
      var physicalRow = row;

      if (source !== this.pluginName) {
        physicalRow = this.rowsMapper.getValueByIndex(physicalRow);
      }

      return physicalRow;
    }

    /**
     * On unmodifyRow listener.
     *
     * @private
     * @param {Number} row Physical row index.
     * @param {String} source Source name.
     * @returns {Number|null}
     */

  }, {
    key: 'onUnmodifyRow',
    value: function onUnmodifyRow(row, source) {
      var visualRow = row;

      if (source !== this.pluginName) {
        visualRow = this.rowsMapper.getIndexByValue(visualRow);
      }

      return visualRow;
    }

    /**
     * `beforeCreateRow` hook callback.
     *
     * @private
     * @param {Number} index Index of the newly created row.
     * @param {Number} amount Amount of created rows.
     * @param {String} source Source of the change.
     */

  }, {
    key: 'onBeforeCreateRow',
    value: function onBeforeCreateRow(index, amount, source) {
      return !(this.isEnabled() && this.trimmedRows.length > 0 && source === 'auto');
    }

    /**
     * On after create row listener.
     *
     * @private
     * @param {Number} index Visual row index.
     * @param {Number} amount Defines how many rows removed.
     */

  }, {
    key: 'onAfterCreateRow',
    value: function onAfterCreateRow(index, amount) {
      this.rowsMapper.shiftItems(index, amount);
    }

    /**
     * On before remove row listener.
     *
     * @private
     * @param {Number} index Visual row index.
     * @param {Number} amount Defines how many rows removed.
     *
     * @fires Hooks#modifyRow
     */

  }, {
    key: 'onBeforeRemoveRow',
    value: function onBeforeRemoveRow(index, amount) {
      var _this5 = this;

      this.removedRows.length = 0;

      if (index !== false) {
        // Collect physical row index.
        rangeEach(index, index + amount - 1, function (removedIndex) {
          _this5.removedRows.push(_this5.hot.runHooks('modifyRow', removedIndex, _this5.pluginName));
        });
      }
    }

    /**
     * On after remove row listener.
     *
     * @private
     */

  }, {
    key: 'onAfterRemoveRow',
    value: function onAfterRemoveRow() {
      this.rowsMapper.unshiftItems(this.removedRows);
    }

    /**
     * On after load data listener.
     *
     * @private
     * @param {Boolean} firstRun Indicates if hook was fired while Handsontable initialization.
     */

  }, {
    key: 'onAfterLoadData',
    value: function onAfterLoadData(firstRun) {
      if (!firstRun) {
        this.rowsMapper.createMap(this.hot.countSourceRows());
      }
    }

    /**
     * Destroys the plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.rowsMapper.destroy();
      _get(TrimRows.prototype.__proto__ || Object.getPrototypeOf(TrimRows.prototype), 'destroy', this).call(this);
    }
  }]);

  return TrimRows;
}(BasePlugin);

registerPlugin('trimRows', TrimRows);

export default TrimRows;