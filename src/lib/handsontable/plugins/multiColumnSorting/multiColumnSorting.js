var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import ColumnSorting from 'handsontable/es/plugins/columnSorting/columnSorting';
import { registerRootComparator } from 'handsontable/es/plugins/columnSorting/sortService';
import { wasHeaderClickedProperly } from 'handsontable/es/plugins/columnSorting/utils';
import { registerPlugin } from 'handsontable/es/plugins';
import { isPressedCtrlKey } from 'handsontable/es/utils/keyStateObserver';
import { addClass, removeClass } from 'handsontable/es/helpers/dom/element';
import { rootComparator } from './rootComparator';
import { warnAboutPluginsConflict } from './utils';
import { getClassesToAdd, getClassedToRemove } from './domHelpers';


var APPEND_COLUMN_CONFIG_STRATEGY = 'append';
var PLUGIN_KEY = 'multiColumnSorting';
var CONFLICTED_PLUGIN_KEY = 'columnSorting';

registerRootComparator(PLUGIN_KEY, rootComparator);

/**
 * @plugin MultiColumnSorting
 * @pro
 *
 * @description
 * This plugin sorts the view by columns (but does not sort the data source!). To enable the plugin, set the
 * {@link Options#multiColumnSorting} property to the correct value (see the examples below).
 *
 * @example
 * ```js
 * // as boolean
 * multiColumnSorting: true
 *
 * // as an object with initial sort config (sort ascending for column at index 1 and then sort descending for column at index 0)
 * multiColumnSorting: {
 *   initialConfig: [{
 *     column: 1,
 *     sortOrder: 'asc'
 *   }, {
 *     column: 0,
 *     sortOrder: 'desc'
 *   }]
 * }
 *
 * // as an object which define specific sorting options for all columns
 * multiColumnSorting: {
 *   sortEmptyCells: true, // true = the table sorts empty cells, false = the table moves all empty cells to the end of the table (by default)
 *   indicator: true, // true = shows indicator for all columns (by default), false = don't show indicator for columns
 *   headerAction: true, // true = allow to click on the headers to sort (by default), false = turn off possibility to click on the headers to sort
 *   compareFunctionFactory: function(sortOrder, columnMeta) {
 *     return function(value, nextValue) {
 *       // Some value comparisons which will return -1, 0 or 1...
 *     }
 *   }
 * }
 *
 * // as an object passed to the `column` property, allows specifying a custom options for the desired column.
 * // please take a look at documentation of `column` property: https://docs.handsontable.com/pro/Options.html#columns
 * columns: [{
 *   multiColumnSorting: {
 *     indicator: false, // disable indicator for the first column,
 *     sortEmptyCells: true,
 *     headerAction: false, // clicks on the first column won't sort
 *     compareFunctionFactory: function(sortOrder, columnMeta) {
 *       return function(value, nextValue) {
 *         return 0; // Custom compare function for the first column (don't sort)
 *       }
 *     }
 *   }
 * }]```
 *
 * @dependencies ObserveChanges
 */

var MultiColumnSorting = function (_ColumnSorting) {
  _inherits(MultiColumnSorting, _ColumnSorting);

  function MultiColumnSorting(hotInstance) {
    _classCallCheck(this, MultiColumnSorting);

    /**
     * Main settings key designed for the plugin.
     *
     * @private
     * @type {String}
     */
    var _this = _possibleConstructorReturn(this, (MultiColumnSorting.__proto__ || Object.getPrototypeOf(MultiColumnSorting)).call(this, hotInstance));

    _this.pluginKey = PLUGIN_KEY;
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the Handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link MultiColumnSorting#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(MultiColumnSorting, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'isEnabled', this).call(this);
    }

    /**
     * Enables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'enablePlugin',
    value: function enablePlugin() {
      if (!this.enabled && this.hot.getSettings()[this.pluginKey] && this.hot.getSettings()[CONFLICTED_PLUGIN_KEY]) {
        warnAboutPluginsConflict();
      }

      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Sorts the table by chosen columns and orders.
     *
     * @param {undefined|Object|Array} sortConfig Single column sort configuration or full sort configuration (for all sorted columns).
     * The configuration object contains `column` and `sortOrder` properties. First of them contains visual column index, the second one contains
     * sort order (`asc` for ascending, `desc` for descending).
     *
     * **Note**: Please keep in mind that every call of `sort` function set an entirely new sort order. Previous sort configs aren't preserved.
     *
     * @example
     * ```js
     * // sort ascending first visual column
     * hot.getPlugin('multiColumnSorting').sort({ column: 0, sortOrder: 'asc' });
     *
     * // sort first two visual column in the defined sequence
     * hot.getPlugin('multiColumnSorting').sort([{
     *   column: 1, sortOrder: 'asc'
     * }, {
     *   column: 0, sortOrder: 'desc'
     * }]);
     * ```
     *
     * @fires Hooks#beforeColumnSort
     * @fires Hooks#afterColumnSort
     */

  }, {
    key: 'sort',
    value: function sort(sortConfig) {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'sort', this).call(this, sortConfig);
    }

    /**
     * Clear the sort performed on the table.
     */

  }, {
    key: 'clearSort',
    value: function clearSort() {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'clearSort', this).call(this);
    }

    /**
     * Checks if the table is sorted (any column have to be sorted).
     *
     * @returns {Boolean}
     */

  }, {
    key: 'isSorted',
    value: function isSorted() {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'isSorted', this).call(this);
    }

    /**
     * Get sort configuration for particular column or for all sorted columns. Objects contain `column` and `sortOrder` properties.
     *
     * **Note**: Please keep in mind that returned objects expose **visual** column index under the `column` key. They are handled by the `sort` function.
     *
     * @param {Number} [column] Visual column index.
     * @returns {undefined|Object|Array}
     */

  }, {
    key: 'getSortConfig',
    value: function getSortConfig(column) {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'getSortConfig', this).call(this, column);
    }

    /**
     * @description
     * Warn: Useful mainly for providing server side sort implementation (see in the example below). It doesn't sort the data set. It just sets sort configuration for all sorted columns.
     *
     * @example
     * ```js
     * beforeColumnSort: function(currentSortConfig, destinationSortConfigs) {
     *   const columnSortPlugin = this.getPlugin('multiColumnSorting');
     *
     *   columnSortPlugin.setSortConfig(destinationSortConfigs);
     *
     *   // const newData = ... // Calculated data set, ie. from an AJAX call.
     *
     *   // this.loadData(newData); // Load new data set.
     *
     *   return false; // The blockade for the default sort action.
     * }```
     *
     * @param {undefined|Object|Array} sortConfig Single column sort configuration or full sort configuration (for all sorted columns).
     * The configuration object contains `column` and `sortOrder` properties. First of them contains visual column index, the second one contains
     * sort order (`asc` for ascending, `desc` for descending).
     */

  }, {
    key: 'setSortConfig',
    value: function setSortConfig(sortConfig) {
      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'setSortConfig', this).call(this, sortConfig);
    }

    /**
     * Get normalized sort configs.
     *
     * @private
     * @param {Object|Array} [sortConfig=[]] Single column sort configuration or full sort configuration (for all sorted columns).
     * The configuration object contains `column` and `sortOrder` properties. First of them contains visual column index, the second one contains
     * sort order (`asc` for ascending, `desc` for descending).
     * @returns {Array}
     */

  }, {
    key: 'getNormalizedSortConfigs',
    value: function getNormalizedSortConfigs() {
      var sortConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (Array.isArray(sortConfig)) {
        return sortConfig;
      }

      return [sortConfig];
    }

    /**
     * Update header classes.
     *
     * @private
     * @param {HTMLElement} headerSpanElement Header span element.
     * @param {...*} args Extra arguments for helpers.
     */

  }, {
    key: 'updateHeaderClasses',
    value: function updateHeaderClasses(headerSpanElement) {
      var _get2;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_get2 = _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'updateHeaderClasses', this)).call.apply(_get2, [this, headerSpanElement].concat(args));

      removeClass(headerSpanElement, getClassedToRemove(headerSpanElement));

      if (this.enabled !== false) {
        addClass(headerSpanElement, getClassesToAdd.apply(undefined, args));
      }
    }

    /**
     * Overwriting base plugin's `onUpdateSettings` method. Please keep in mind that `onAfterUpdateSettings` isn't called
     * for `updateSettings` in specific situations.
     *
     * @private
     * @param {Object} newSettings New settings object.
     */

  }, {
    key: 'onUpdateSettings',
    value: function onUpdateSettings(newSettings) {
      if (this.hot.getSettings()[this.pluginKey] && this.hot.getSettings()[CONFLICTED_PLUGIN_KEY]) {
        warnAboutPluginsConflict();
      }

      return _get(MultiColumnSorting.prototype.__proto__ || Object.getPrototypeOf(MultiColumnSorting.prototype), 'onUpdateSettings', this).call(this, newSettings);
    }

    /**
     * Callback for the `onAfterOnCellMouseDown` hook.
     *
     * @private
     * @param {Event} event Event which are provided by hook.
     * @param {CellCoords} coords Visual coords of the selected cell.
     */

  }, {
    key: 'onAfterOnCellMouseDown',
    value: function onAfterOnCellMouseDown(event, coords) {
      if (wasHeaderClickedProperly(coords.row, coords.col, event) === false) {
        return;
      }

      if (this.wasClickableHeaderClicked(event, coords.col)) {
        if (isPressedCtrlKey()) {
          this.hot.deselectCell();
          this.hot.selectColumns(coords.col);

          this.sort(this.getNextSortConfig(coords.col, APPEND_COLUMN_CONFIG_STRATEGY));
        } else {
          this.sort(this.getColumnNextConfig(coords.col));
        }
      }
    }
  }]);

  return MultiColumnSorting;
}(ColumnSorting);

registerPlugin(PLUGIN_KEY, MultiColumnSorting);

export default MultiColumnSorting;