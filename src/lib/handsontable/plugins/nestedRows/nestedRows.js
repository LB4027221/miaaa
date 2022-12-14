var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base';
import { registerPlugin } from 'handsontable/es/plugins';
import { rangeEach } from 'handsontable/es/helpers/number';
import { arrayEach } from 'handsontable/es/helpers/array';
import { CellCoords } from 'handsontable/es/3rdparty/walkontable/src';
import DataManager from './data/dataManager';
import CollapsingUI from './ui/collapsing';
import HeadersUI from './ui/headers';
import ContextMenuUI from './ui/contextMenu';

var privatePool = new WeakMap();

/**
 * @plugin NestedRows
 * @pro
 * @experimental
 *
 * @description
 * Plugin responsible for displaying and operating on data sources with nested structures.
 *
 * @dependencies TrimRows BindRowsWithHeaders
 */

var NestedRows = function (_BasePlugin) {
  _inherits(NestedRows, _BasePlugin);

  function NestedRows(hotInstance) {
    _classCallCheck(this, NestedRows);

    /**
     * Source data object.
     *
     * @private
     * @type {Object}
     */
    var _this = _possibleConstructorReturn(this, (NestedRows.__proto__ || Object.getPrototypeOf(NestedRows)).call(this, hotInstance));

    _this.sourceData = null;
    /**
     * Reference to the Trim Rows plugin.
     *
     * @private
     * @type {Object}
     */
    _this.trimRowsPlugin = null;
    /**
     * Reference to the BindRowsWithHeaders plugin.
     *
     * @private
     * @type {Object}
     */
    _this.bindRowsWithHeadersPlugin = null;

    /**
     * Reference to the DataManager instance.
     *
     * @private
     * @type {Object}
     */
    _this.dataManager = null;

    /**
     * Reference to the HeadersUI instance.
     *
     * @private
     * @type {Object}
     */
    _this.headersUI = null;

    privatePool.set(_this, {
      changeSelection: false,
      movedToFirstChild: false,
      movedToCollapsed: false,
      skipRender: null
    });
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link NestedRows#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(NestedRows, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().nestedRows;
    }

    /**
     * Enables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'enablePlugin',
    value: function enablePlugin() {
      var _this2 = this;

      this.sourceData = this.hot.getSourceData();
      this.trimRowsPlugin = this.hot.getPlugin('trimRows');
      this.manualRowMovePlugin = this.hot.getPlugin('manualRowMove');
      this.bindRowsWithHeadersPlugin = this.hot.getPlugin('bindRowsWithHeaders');

      this.dataManager = new DataManager(this, this.hot, this.sourceData);
      this.collapsingUI = new CollapsingUI(this, this.hot, this.trimRowsPlugin);
      this.headersUI = new HeadersUI(this, this.hot);
      this.contextMenuUI = new ContextMenuUI(this, this.hot);

      this.dataManager.rewriteCache();

      this.addHook('afterInit', function () {
        return _this2.onAfterInit.apply(_this2, arguments);
      });
      this.addHook('beforeRender', function () {
        return _this2.onBeforeRender.apply(_this2, arguments);
      });
      this.addHook('modifyRowData', function () {
        return _this2.onModifyRowData.apply(_this2, arguments);
      });
      this.addHook('modifySourceLength', function () {
        return _this2.onModifySourceLength.apply(_this2, arguments);
      });
      this.addHook('beforeDataSplice', function () {
        return _this2.onBeforeDataSplice.apply(_this2, arguments);
      });
      this.addHook('beforeDataFilter', function () {
        return _this2.onBeforeDataFilter.apply(_this2, arguments);
      });
      this.addHook('afterContextMenuDefaultOptions', function () {
        return _this2.onAfterContextMenuDefaultOptions.apply(_this2, arguments);
      });
      this.addHook('afterGetRowHeader', function () {
        return _this2.onAfterGetRowHeader.apply(_this2, arguments);
      });
      this.addHook('beforeOnCellMouseDown', function () {
        return _this2.onBeforeOnCellMouseDown.apply(_this2, arguments);
      });
      this.addHook('afterRemoveRow', function () {
        return _this2.onAfterRemoveRow.apply(_this2, arguments);
      });
      this.addHook('modifyRemovedAmount', function () {
        return _this2.onModifyRemovedAmount.apply(_this2, arguments);
      });
      this.addHook('beforeAddChild', function () {
        return _this2.onBeforeAddChild.apply(_this2, arguments);
      });
      this.addHook('afterAddChild', function () {
        return _this2.onAfterAddChild.apply(_this2, arguments);
      });
      this.addHook('beforeDetachChild', function () {
        return _this2.onBeforeDetachChild.apply(_this2, arguments);
      });
      this.addHook('afterDetachChild', function () {
        return _this2.onAfterDetachChild.apply(_this2, arguments);
      });
      this.addHook('modifyRowHeaderWidth', function () {
        return _this2.onModifyRowHeaderWidth.apply(_this2, arguments);
      });
      this.addHook('afterCreateRow', function () {
        return _this2.onAfterCreateRow.apply(_this2, arguments);
      });
      this.addHook('beforeRowMove', function () {
        return _this2.onBeforeRowMove.apply(_this2, arguments);
      });
      this.addHook('afterRowMove', function () {
        return _this2.onAfterRowMove.apply(_this2, arguments);
      });

      if (!this.trimRowsPlugin.isEnabled()) {
        // Workaround to prevent calling updateSetttings in the enablePlugin method, which causes many problems.
        this.trimRowsPlugin.enablePlugin();
        this.hot.getSettings().trimRows = true;
      }

      _get(NestedRows.prototype.__proto__ || Object.getPrototypeOf(NestedRows.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      _get(NestedRows.prototype.__proto__ || Object.getPrototypeOf(NestedRows.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: 'updatePlugin',
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();

      _get(NestedRows.prototype.__proto__ || Object.getPrototypeOf(NestedRows.prototype), 'updatePlugin', this).call(this);
    }

    /**
     * `beforeRowMove` hook callback.
     *
     * @private
     * @param {Array} rows Array of row indexes to be moved.
     * @param {Number} target Index of the target row.
     */

  }, {
    key: 'onBeforeRowMove',
    value: function onBeforeRowMove(rows, target) {
      var priv = privatePool.get(this);
      var rowsLen = rows.length;
      var translatedStartIndexes = [];

      var translatedTargetIndex = this.dataManager.translateTrimmedRow(target);
      var allowMove = true;
      var i = void 0;
      var fromParent = null;
      var toParent = null;
      var sameParent = null;

      for (i = 0; i < rowsLen; i++) {
        translatedStartIndexes.push(this.dataManager.translateTrimmedRow(rows[i]));

        if (this.dataManager.isParent(translatedStartIndexes[i])) {
          allowMove = false;
        }
      }

      if (translatedStartIndexes.indexOf(translatedTargetIndex) > -1 || !allowMove) {
        return false;
      }

      fromParent = this.dataManager.getRowParent(translatedStartIndexes[0]);
      toParent = this.dataManager.getRowParent(translatedTargetIndex);

      if (toParent === null || toParent === void 0) {
        toParent = this.dataManager.getRowParent(translatedTargetIndex - 1);
      }

      if (toParent === null || toParent === void 0) {
        toParent = this.dataManager.getDataObject(translatedTargetIndex - 1);
        priv.movedToFirstChild = true;
      }

      if (!toParent) {
        return false;
      }

      sameParent = fromParent === toParent;
      priv.movedToCollapsed = this.collapsingUI.areChildrenCollapsed(toParent);
      this.collapsingUI.collapsedRowsStash.stash();

      if (!sameParent) {
        if (Math.max.apply(Math, translatedStartIndexes) <= translatedTargetIndex) {
          this.collapsingUI.collapsedRowsStash.shiftStash(translatedStartIndexes[0], -1 * rows.length);
        } else {
          this.collapsingUI.collapsedRowsStash.shiftStash(translatedTargetIndex, rows.length);
        }
      }

      priv.changeSelection = true;

      if (translatedStartIndexes[rowsLen - 1] <= translatedTargetIndex && sameParent || priv.movedToFirstChild === true) {
        rows.reverse();
        translatedStartIndexes.reverse();

        if (priv.movedToFirstChild !== true) {
          translatedTargetIndex -= 1;
        }
      }

      for (i = 0; i < rowsLen; i++) {
        this.dataManager.moveRow(translatedStartIndexes[i], translatedTargetIndex);
      }

      var movingDown = translatedStartIndexes[translatedStartIndexes.length - 1] < translatedTargetIndex;

      if (movingDown) {
        for (i = rowsLen - 1; i >= 0; i--) {
          this.dataManager.moveCellMeta(translatedStartIndexes[i], translatedTargetIndex);
        }
      } else {
        for (i = 0; i < rowsLen; i++) {
          this.dataManager.moveCellMeta(translatedStartIndexes[i], translatedTargetIndex);
        }
      }

      if (translatedStartIndexes[rowsLen - 1] <= translatedTargetIndex && sameParent || this.dataManager.isParent(translatedTargetIndex)) {
        rows.reverse();
      }

      this.dataManager.rewriteCache();

      return false;
    }

    /**
     * `afterRowMove` hook callback.
     *
     * @private
     * @param {Array} rows Array of row indexes to be moved.
     * @param {Number} target Index of the target row.
     */

  }, {
    key: 'onAfterRowMove',
    value: function onAfterRowMove(rows, target) {
      var priv = privatePool.get(this);

      if (!priv.changeSelection) {
        return;
      }

      var rowsLen = rows.length;
      var startRow = 0;
      var endRow = 0;
      var translatedTargetIndex = null;
      var selection = null;
      var lastColIndex = null;

      this.collapsingUI.collapsedRowsStash.applyStash();

      translatedTargetIndex = this.dataManager.translateTrimmedRow(target);

      if (priv.movedToFirstChild) {
        priv.movedToFirstChild = false;

        startRow = target;
        endRow = target + rowsLen - 1;

        if (target >= Math.max.apply(Math, _toConsumableArray(rows))) {
          startRow -= rowsLen;
          endRow -= rowsLen;
        }
      } else if (priv.movedToCollapsed) {
        var parentObject = this.dataManager.getRowParent(translatedTargetIndex - 1);
        if (parentObject === null || parentObject === void 0) {
          parentObject = this.dataManager.getDataObject(translatedTargetIndex - 1);
        }
        var parentIndex = this.dataManager.getRowIndex(parentObject);

        startRow = parentIndex;
        endRow = startRow;
      } else if (rows[rowsLen - 1] < target) {
        endRow = target - 1;
        startRow = endRow - rowsLen + 1;
      } else {
        startRow = target;
        endRow = startRow + rowsLen - 1;
      }

      selection = this.hot.selection;
      lastColIndex = this.hot.countCols() - 1;

      selection.setRangeStart(new CellCoords(startRow, 0));
      selection.setRangeEnd(new CellCoords(endRow, lastColIndex), true);

      priv.changeSelection = false;
    }

    /**
     * `beforeOnCellMousedown` hook callback.
     *
     * @private
     * @param {MouseEvent} event Mousedown event.
     * @param {Object} coords Cell coords.
     * @param {HTMLElement} TD clicked cell.
     */

  }, {
    key: 'onBeforeOnCellMouseDown',
    value: function onBeforeOnCellMouseDown(event, coords, TD) {
      this.collapsingUI.toggleState(event, coords, TD);
    }

    /**
     * The modifyRowData hook callback.
     *
     * @private
     * @param {Number} row Visual row index.
     */

  }, {
    key: 'onModifyRowData',
    value: function onModifyRowData(row) {
      return this.dataManager.getDataObject(row);
    }

    /**
     * Modify the source data length to match the length of the nested structure.
     *
     * @private
     * @returns {Number}
     */

  }, {
    key: 'onModifySourceLength',
    value: function onModifySourceLength() {
      return this.dataManager.countAllRows();
    }

    /**
     * @private
     * @param {Number} index
     * @param {Number} amount
     * @param {Object} element
     * @returns {Boolean}
     */

  }, {
    key: 'onBeforeDataSplice',
    value: function onBeforeDataSplice(index, amount, element) {
      this.dataManager.spliceData(index, amount, element);

      return false;
    }

    /**
     * Called before the source data filtering. Returning `false` stops the native filtering.
     *
     * @private
     * @param {Number} index
     * @param {Number} amount
     * @returns {Boolean}
     */

  }, {
    key: 'onBeforeDataFilter',
    value: function onBeforeDataFilter(index, amount) {
      var realLogicRows = [];
      var startIndex = this.dataManager.translateTrimmedRow(index);
      var priv = privatePool.get(this);

      rangeEach(startIndex, startIndex + amount - 1, function (i) {
        realLogicRows.push(i);
      });

      this.collapsingUI.collapsedRowsStash.stash();
      this.collapsingUI.collapsedRowsStash.trimStash(startIndex, amount);
      this.collapsingUI.collapsedRowsStash.shiftStash(startIndex, -1 * amount);
      this.dataManager.filterData(index, amount, realLogicRows);

      priv.skipRender = true;

      return false;
    }

    /**
     * `afterContextMenuDefaultOptions` hook callback.
     *
     * @private
     * @param {Object} defaultOptions
     */

  }, {
    key: 'onAfterContextMenuDefaultOptions',
    value: function onAfterContextMenuDefaultOptions(defaultOptions) {
      return this.contextMenuUI.appendOptions(defaultOptions);
    }

    /**
     * `afterGetRowHeader` hook callback.
     *
     * @private
     * @param {Number} row Row index.
     * @param {HTMLElement} TH row header element.
     */

  }, {
    key: 'onAfterGetRowHeader',
    value: function onAfterGetRowHeader(row, TH) {
      this.headersUI.appendLevelIndicators(row, TH);
    }

    /**
     * `modifyRowHeaderWidth` hook callback.
     *
     * @private
     * @param {Number} rowHeaderWidth The initial row header width(s).
     * @returns {Number}
     */

  }, {
    key: 'onModifyRowHeaderWidth',
    value: function onModifyRowHeaderWidth(rowHeaderWidth) {
      return this.headersUI.rowHeaderWidthCache || rowHeaderWidth;
    }

    /**
     * `onAfterRemoveRow` hook callback.
     *
     * @private
     * @param {Number} index Removed row.
     * @param {Number} amount Amount of removed rows.
     * @param {Array} logicRows
     * @param {String} source Source of action.
     */

  }, {
    key: 'onAfterRemoveRow',
    value: function onAfterRemoveRow(index, amount, logicRows, source) {
      var _this3 = this;

      if (source === this.pluginName) {
        return;
      }

      var priv = privatePool.get(this);

      setTimeout(function () {
        priv.skipRender = null;
        _this3.headersUI.updateRowHeaderWidth();
        _this3.collapsingUI.collapsedRowsStash.applyStash();
      }, 0);
    }

    /**
     * `modifyRemovedAmount` hook callback.
     *
     * @private
     * @param {Number} amount Initial amount.
     * @param {Number} index Index of the starting row.
     * @returns {Number} Modified amount.
     */

  }, {
    key: 'onModifyRemovedAmount',
    value: function onModifyRemovedAmount(amount, index) {
      var _this4 = this;

      var lastParents = [];
      var childrenCount = 0;

      rangeEach(index, index + amount - 1, function (i) {
        var isChild = false;
        var translated = _this4.collapsingUI.translateTrimmedRow(i);
        var currentDataObj = _this4.dataManager.getDataObject(translated);

        if (_this4.dataManager.hasChildren(currentDataObj)) {
          lastParents.push(currentDataObj);

          arrayEach(lastParents, function (elem) {
            if (elem.__children.indexOf(currentDataObj) > -1) {
              isChild = true;
              return false;
            }
          });

          if (!isChild) {
            childrenCount += _this4.dataManager.countChildren(currentDataObj);
          }
        }

        isChild = false;
        arrayEach(lastParents, function (elem) {
          if (elem.__children.indexOf(currentDataObj) > -1) {
            isChild = true;
            return false;
          }
        });

        if (isChild) {
          childrenCount -= 1;
        }
      });

      return amount + childrenCount;
    }

    /**
     * `beforeAddChild` hook callback.
     *
     * @private
     */

  }, {
    key: 'onBeforeAddChild',
    value: function onBeforeAddChild() {
      this.collapsingUI.collapsedRowsStash.stash();
    }

    /**
     * `afterAddChild` hook callback.
     *
     * @private
     * @param {Object} parent Parent element.
     * @param {Object} element New child element.
     */

  }, {
    key: 'onAfterAddChild',
    value: function onAfterAddChild(parent, element) {
      this.collapsingUI.collapsedRowsStash.shiftStash(this.dataManager.getRowIndex(element));
      this.collapsingUI.collapsedRowsStash.applyStash();

      this.headersUI.updateRowHeaderWidth();
    }

    /**
     * `beforeDetachChild` hook callback.
     *
     * @private
     */

  }, {
    key: 'onBeforeDetachChild',
    value: function onBeforeDetachChild() {
      this.collapsingUI.collapsedRowsStash.stash();
    }

    /**
     * `afterDetachChild` hook callback.
     *
     * @private
     * @param {Object} parent Parent element.
     * @param {Object} element New child element.
     */

  }, {
    key: 'onAfterDetachChild',
    value: function onAfterDetachChild(parent, element) {
      this.collapsingUI.collapsedRowsStash.shiftStash(this.dataManager.getRowIndex(element));
      this.collapsingUI.collapsedRowsStash.applyStash();

      this.headersUI.updateRowHeaderWidth();
    }

    /**
     * `afterCreateRow` hook callback.
     *
     * @private
     * @param {Number} index
     * @param {Number} amount
     * @param {String} source
     */

  }, {
    key: 'onAfterCreateRow',
    value: function onAfterCreateRow(index, amount, source) {
      if (source === this.pluginName) {
        return;
      }
      this.dataManager.rewriteCache();
    }

    /**
     * `afterInit` hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterInit',
    value: function onAfterInit() {
      // Workaround to fix an issue caused by the 'bindRowsWithHeaders' plugin loading before this one.
      if (this.bindRowsWithHeadersPlugin.bindStrategy.strategy) {
        this.bindRowsWithHeadersPlugin.bindStrategy.createMap(this.hot.countSourceRows());
      }

      var deepestLevel = Math.max.apply(Math, _toConsumableArray(this.dataManager.cache.levels));

      if (deepestLevel > 0) {
        this.headersUI.updateRowHeaderWidth(deepestLevel);
      }
    }

    /**
     * `beforeRender` hook callback.
     *
     * @param {Boolean} force
     * @param {Object} skipRender
     * @private
     */

  }, {
    key: 'onBeforeRender',
    value: function onBeforeRender(force, skipRender) {
      var priv = privatePool.get(this);

      if (priv.skipRender) {
        skipRender.skipRender = true;
      }
    }
  }]);

  return NestedRows;
}(BasePlugin);

registerPlugin('nestedRows', NestedRows);

export default NestedRows;