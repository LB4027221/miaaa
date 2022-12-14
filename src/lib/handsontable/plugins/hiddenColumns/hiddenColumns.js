var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base';
import { addClass } from 'handsontable/es/helpers/dom/element';
import { rangeEach } from 'handsontable/es/helpers/number';
import { arrayEach } from 'handsontable/es/helpers/array';
import { registerPlugin } from 'handsontable/es/plugins';
import { SEPARATOR } from 'handsontable/es/plugins/contextMenu/predefinedItems';
import hideColumnItem from './contextMenuItem/hideColumn';
import showColumnItem from './contextMenuItem/showColumn';

/**
 * @plugin HiddenColumns
 * @pro
 *
 * @description
 * Plugin allows to hide certain columns. The hiding is achieved by rendering the columns with width set as 0px.
 * The plugin not modifies the source data and do not participate in data transformation (the shape of data returned
 * by `getData*` methods stays intact).
 *
 * Possible plugin settings:
 *  * `copyPasteEnabled` as `Boolean` (default `true`)
 *  * `columns` as `Array`
 *  * `indicators` as `Boolean` (default `false`)
 *
 * @example
 *
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   date: getData(),
 *   hiddenColumns: {
 *     copyPasteEnabled: true,
 *     indicators: true,
 *     columns: [1, 2, 5]
 *   }
 * });
 *
 * // access to hiddenRows plugin instance:
 * const hiddenColumnsPlugin = hot.getPlugin('hiddenColumns');
 *
 * // show single row
 * hiddenColumnsPlugin.showColumn(1);
 *
 * // show multiple rows
 * hiddenColumnsPlugin.showColumn(1, 2, 9);
 *
 * // or as an array
 * hiddenColumnsPlugin.showColumns([1, 2, 9]);
 *
 * // hide single row
 * hiddenColumnsPlugin.hideColumn(1);
 *
 * // hide multiple rows
 * hiddenColumnsPlugin.hideColumn(1, 2, 9);
 *
 * // or as an array
 * hiddenColumnsPlugin.hideColumns([1, 2, 9]);
 *
 * // rerender the table to see all changes
 * hot.render();
 * ```
 */
var HiddenColumns = function (_BasePlugin) {
  _inherits(HiddenColumns, _BasePlugin);

  function HiddenColumns(hotInstance) {
    _classCallCheck(this, HiddenColumns);

    /**
     * Cached plugin settings.
     *
     * @private
     * @type {Object}
     */
    var _this = _possibleConstructorReturn(this, (HiddenColumns.__proto__ || Object.getPrototypeOf(HiddenColumns)).call(this, hotInstance));

    _this.settings = {};
    /**
     * List of currently hidden columns
     *
     * @private
     * @type {Number[]}
     */
    _this.hiddenColumns = [];
    /**
     * Last selected column index.
     *
     * @private
     * @type {Number}
     * @default -1
     */
    _this.lastSelectedColumn = -1;
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link HiddenColumns#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(HiddenColumns, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().hiddenColumns;
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

      if (this.hot.hasColHeaders()) {
        this.addHook('afterGetColHeader', function (col, TH) {
          return _this2.onAfterGetColHeader(col, TH);
        });
      } else {
        this.addHook('afterRenderer', function (TD, row, col) {
          return _this2.onAfterGetColHeader(col, TD);
        });
      }

      this.addHook('afterContextMenuDefaultOptions', function (options) {
        return _this2.onAfterContextMenuDefaultOptions(options);
      });
      this.addHook('afterGetCellMeta', function (row, col, cellProperties) {
        return _this2.onAfterGetCellMeta(row, col, cellProperties);
      });
      this.addHook('modifyColWidth', function (width, col) {
        return _this2.onModifyColWidth(width, col);
      });
      this.addHook('beforeSetRangeStartOnly', function (coords) {
        return _this2.onBeforeSetRangeStart(coords);
      });
      this.addHook('beforeSetRangeEnd', function (coords) {
        return _this2.onBeforeSetRangeEnd(coords);
      });
      this.addHook('hiddenColumn', function (column) {
        return _this2.isHidden(column);
      });
      this.addHook('beforeStretchingColumnWidth', function (width, column) {
        return _this2.onBeforeStretchingColumnWidth(width, column);
      });
      this.addHook('afterCreateCol', function (index, amount) {
        return _this2.onAfterCreateCol(index, amount);
      });
      this.addHook('afterRemoveCol', function (index, amount) {
        return _this2.onAfterRemoveCol(index, amount);
      });

      // Dirty workaround - the section below runs only if the HOT instance is already prepared.
      if (this.hot.view) {
        this.onAfterPluginsInitialized();
      }

      _get(HiddenColumns.prototype.__proto__ || Object.getPrototypeOf(HiddenColumns.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: 'updatePlugin',
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();

      _get(HiddenColumns.prototype.__proto__ || Object.getPrototypeOf(HiddenColumns.prototype), 'updatePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.settings = {};
      this.hiddenColumns = [];
      this.lastSelectedColumn = -1;

      this.hot.render();
      _get(HiddenColumns.prototype.__proto__ || Object.getPrototypeOf(HiddenColumns.prototype), 'disablePlugin', this).call(this);
      this.resetCellsMeta();
    }

    /**
     * Shows the provided columns.
     *
     * @param {Number[]} columns Array of column indexes.
     */

  }, {
    key: 'showColumns',
    value: function showColumns(columns) {
      var _this3 = this;

      arrayEach(columns, function (column) {
        var columnIndex = parseInt(column, 10);
        columnIndex = _this3.getLogicalColumnIndex(columnIndex);

        if (_this3.isHidden(columnIndex, true)) {
          _this3.hiddenColumns.splice(_this3.hiddenColumns.indexOf(columnIndex), 1);
        }
      });
    }

    /**
     * Shows a single column.
     *
     * @param {...Number} column Column index.
     */

  }, {
    key: 'showColumn',
    value: function showColumn() {
      for (var _len = arguments.length, column = Array(_len), _key = 0; _key < _len; _key++) {
        column[_key] = arguments[_key];
      }

      this.showColumns(column);
    }

    /**
     * Hides the columns provided in the array.
     *
     * @param {Number[]} columns Array of column indexes.
     */

  }, {
    key: 'hideColumns',
    value: function hideColumns(columns) {
      var _this4 = this;

      arrayEach(columns, function (column) {
        var columnIndex = parseInt(column, 10);
        columnIndex = _this4.getLogicalColumnIndex(columnIndex);

        if (!_this4.isHidden(columnIndex, true)) {
          _this4.hiddenColumns.push(columnIndex);
        }
      });
    }

    /**
     * Hides a single column.
     *
     * @param {...Number} column Column index.
     */

  }, {
    key: 'hideColumn',
    value: function hideColumn() {
      for (var _len2 = arguments.length, column = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        column[_key2] = arguments[_key2];
      }

      this.hideColumns(column);
    }

    /**
     * Checks if the provided column is hidden.
     *
     * @param {Number} column Column index.
     * @param {Boolean} isLogicIndex flag which determines type of index.
     * @returns {Boolean}
     */

  }, {
    key: 'isHidden',
    value: function isHidden(column) {
      var isLogicIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var columnIndex = column;

      if (!isLogicIndex) {
        columnIndex = this.getLogicalColumnIndex(columnIndex);
      }

      return this.hiddenColumns.indexOf(columnIndex) > -1;
    }

    /**
     * Reset all rendered cells meta.
     *
     * @private
     */

  }, {
    key: 'resetCellsMeta',
    value: function resetCellsMeta() {
      arrayEach(this.hot.getCellsMeta(), function (meta) {
        if (meta) {
          meta.skipColumnOnPaste = false;

          if (meta.baseRenderer !== null) {
            meta.renderer = meta.baseRenderer;
            meta.baseRenderer = null;
          }
        }
      });
    }

    /**
     * Get the logical index of the provided column.
     *
     * @private
     * @param {Number} column Column index.
     * @returns {Number}
     *
     * @fires Hooks#modifyCol
     */

  }, {
    key: 'getLogicalColumnIndex',
    value: function getLogicalColumnIndex(column) {
      return this.hot.runHooks('modifyCol', column);
    }

    /**
     * Sets width hidden columns on 0
     *
     * @private
     * @param {Number} width Column width.
     * @param {Number} column Column index.
     * @returns {Number}
     */

  }, {
    key: 'onBeforeStretchingColumnWidth',
    value: function onBeforeStretchingColumnWidth(width, column) {
      var stretchedWidth = width;

      if (this.isHidden(column)) {
        stretchedWidth = 0;
      }

      return stretchedWidth;
    }

    /**
     * Adds the additional column width for the hidden column indicators.
     *
     * @private
     * @param {Number} width
     * @param {Number} col
     * @returns {Number}
     */

  }, {
    key: 'onModifyColWidth',
    value: function onModifyColWidth(width, col) {
      if (this.isHidden(col)) {
        return 0.1;
      } else if (this.settings.indicators && (this.isHidden(col + 1) || this.isHidden(col - 1))) {

        // add additional space for hidden column indicator
        return width + (this.hot.hasColHeaders() ? 15 : 0);
      }
    }

    /**
     * Sets the copy-related cell meta.
     *
     * @private
     * @param {Number} row
     * @param {Number} col
     * @param {Object} cellProperties
     *
     * @fires Hooks#unmodifyCol
     */

  }, {
    key: 'onAfterGetCellMeta',
    value: function onAfterGetCellMeta(row, col, cellProperties) {
      var colIndex = this.hot.runHooks('unmodifyCol', col);

      if (this.settings.copyPasteEnabled === false && this.isHidden(col)) {
        cellProperties.skipColumnOnPaste = true;
      }

      if (this.isHidden(colIndex)) {
        if (cellProperties.renderer !== hiddenRenderer) {
          cellProperties.baseRenderer = cellProperties.renderer;
        }
        cellProperties.renderer = hiddenRenderer;
      } else if (cellProperties.baseRenderer !== null) {
        // We must pass undefined value too (for the purposes of inheritance cell/column settings).
        cellProperties.renderer = cellProperties.baseRenderer;
        cellProperties.baseRenderer = null;
      }

      if (this.isHidden(cellProperties.visualCol - 1)) {
        var firstSectionHidden = true;
        var i = cellProperties.visualCol - 1;

        cellProperties.className = cellProperties.className || '';

        if (cellProperties.className.indexOf('afterHiddenColumn') === -1) {
          cellProperties.className += ' afterHiddenColumn';
        }

        do {
          if (!this.isHidden(i)) {
            firstSectionHidden = false;
            break;
          }

          i -= 1;
        } while (i >= 0);

        if (firstSectionHidden && cellProperties.className.indexOf('firstVisibleColumn') === -1) {
          cellProperties.className += ' firstVisibleColumn';
        }
      } else if (cellProperties.className) {
        var classArr = cellProperties.className.split(' ');

        if (classArr.length) {
          var containAfterHiddenColumn = classArr.indexOf('afterHiddenColumn');

          if (containAfterHiddenColumn > -1) {
            classArr.splice(containAfterHiddenColumn, 1);
          }

          var containFirstVisible = classArr.indexOf('firstVisibleColumn');

          if (containFirstVisible > -1) {
            classArr.splice(containFirstVisible, 1);
          }

          cellProperties.className = classArr.join(' ');
        }
      }
    }

    /**
     * Modifies the copyable range, accordingly to the provided config.
     *
     * @private
     * @param {Array} ranges
     * @returns {Array}
     */

  }, {
    key: 'onModifyCopyableRange',
    value: function onModifyCopyableRange(ranges) {
      var _this5 = this;

      var newRanges = [];

      var pushRange = function pushRange(startRow, endRow, startCol, endCol) {
        newRanges.push({ startRow: startRow, endRow: endRow, startCol: startCol, endCol: endCol });
      };

      arrayEach(ranges, function (range) {
        var isHidden = true;
        var rangeStart = 0;

        rangeEach(range.startCol, range.endCol, function (col) {
          if (_this5.isHidden(col)) {
            if (!isHidden) {
              pushRange(range.startRow, range.endRow, rangeStart, col - 1);
            }

            isHidden = true;
          } else {
            if (isHidden) {
              rangeStart = col;
            }

            if (col === range.endCol) {
              pushRange(range.startRow, range.endRow, rangeStart, col);
            }

            isHidden = false;
          }
        });
      });

      return newRanges;
    }

    /**
     * Adds the needed classes to the headers.
     *
     * @private
     * @param {Number} column
     * @param {HTMLElement} TH
     */

  }, {
    key: 'onAfterGetColHeader',
    value: function onAfterGetColHeader(column, TH) {
      if (this.isHidden(column)) {
        return;
      }

      var firstSectionHidden = true;
      var i = column - 1;

      do {
        if (!this.isHidden(i)) {
          firstSectionHidden = false;
          break;
        }
        i -= 1;
      } while (i >= 0);

      if (firstSectionHidden) {
        addClass(TH, 'firstVisibleColumn');
      }

      if (!this.settings.indicators) {
        return;
      }

      if (this.isHidden(column - 1)) {
        addClass(TH, 'afterHiddenColumn');
      }

      if (this.isHidden(column + 1) && column > -1) {
        addClass(TH, 'beforeHiddenColumn');
      }
    }

    /**
     * On before set range start listener.
     *
     * @private
     * @param {Object} coords Object with `row` and `col` properties.
     */

  }, {
    key: 'onBeforeSetRangeStart',
    value: function onBeforeSetRangeStart(coords) {
      var _this6 = this;

      if (coords.col > 0) {
        return;
      }

      coords.col = 0;

      var getNextColumn = function getNextColumn(col) {
        var visualColumn = col;
        var logicalCol = _this6.getLogicalColumnIndex(visualColumn);

        if (_this6.isHidden(logicalCol, true)) {
          visualColumn += 1;
          visualColumn = getNextColumn(visualColumn);
        }

        return visualColumn;
      };

      coords.col = getNextColumn(coords.col);
    }

    /**
     * On before set range end listener.
     *
     * @private
     * @param {Object} coords Object with `row` and `col` properties.
     */

  }, {
    key: 'onBeforeSetRangeEnd',
    value: function onBeforeSetRangeEnd(coords) {
      var _this7 = this;

      var columnCount = this.hot.countCols();

      var getNextColumn = function getNextColumn(col) {
        var visualColumn = col;
        var logicalCol = _this7.getLogicalColumnIndex(visualColumn);

        if (_this7.isHidden(logicalCol, true)) {
          if (_this7.lastSelectedColumn > visualColumn || coords.col === columnCount - 1) {
            if (visualColumn > 0) {
              visualColumn -= 1;
              visualColumn = getNextColumn(visualColumn);
            } else {
              rangeEach(0, _this7.lastSelectedColumn, function (i) {
                if (!_this7.isHidden(i)) {
                  visualColumn = i;

                  return false;
                }
              });
            }
          } else {
            visualColumn += 1;
            visualColumn = getNextColumn(visualColumn);
          }
        }

        return visualColumn;
      };

      coords.col = getNextColumn(coords.col);
      this.lastSelectedColumn = coords.col;
    }

    /**
     * Add Show-hide columns to context menu.
     *
     * @private
     * @param {Object} options
     */

  }, {
    key: 'onAfterContextMenuDefaultOptions',
    value: function onAfterContextMenuDefaultOptions(options) {
      options.items.push({
        name: SEPARATOR
      }, hideColumnItem(this), showColumnItem(this));
    }

    /**
     * `onAfterCreateCol` hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterCreateCol',
    value: function onAfterCreateCol(index, amount) {
      var tempHidden = [];

      arrayEach(this.hiddenColumns, function (col) {
        var visualColumn = col;

        if (visualColumn >= index) {
          visualColumn += amount;
        }
        tempHidden.push(visualColumn);
      });
      this.hiddenColumns = tempHidden;
    }

    /**
     * `onAfterRemoveCol` hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterRemoveCol',
    value: function onAfterRemoveCol(index, amount) {
      var tempHidden = [];

      arrayEach(this.hiddenColumns, function (col) {
        var visualColumn = col;

        if (visualColumn >= index) {
          visualColumn -= amount;
        }
        tempHidden.push(visualColumn);
      });
      this.hiddenColumns = tempHidden;
    }

    /**
     * `afterPluginsInitialized` hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterPluginsInitialized',
    value: function onAfterPluginsInitialized() {
      var _this8 = this;

      var settings = this.hot.getSettings().hiddenColumns;

      if ((typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) === 'object') {
        this.settings = settings;

        if (settings.copyPasteEnabled === void 0) {
          settings.copyPasteEnabled = true;
        }
        if (Array.isArray(settings.columns)) {
          this.hideColumns(settings.columns);
        }
        if (!settings.copyPasteEnabled) {
          this.addHook('modifyCopyableRange', function (ranges) {
            return _this8.onModifyCopyableRange(ranges);
          });
        }
      }
    }

    /**
     * Destroys the plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(HiddenColumns.prototype.__proto__ || Object.getPrototypeOf(HiddenColumns.prototype), 'destroy', this).call(this);
    }
  }]);

  return HiddenColumns;
}(BasePlugin);

function hiddenRenderer(hotInstance, td) {
  td.textContent = '';
}

registerPlugin('hiddenColumns', HiddenColumns);

export default HiddenColumns;