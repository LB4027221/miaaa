var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { objectEach } from 'handsontable/es/helpers/object';
import { arrayEach } from 'handsontable/es/helpers/array';
import { rangeEach } from 'handsontable/es/helpers/number';
import { warn } from 'handsontable/es/helpers/console';
import { addClass, hasClass, fastInnerText } from 'handsontable/es/helpers/dom/element';
import EventManager from 'handsontable/es/eventManager';
import { registerPlugin } from 'handsontable/es/plugins';
import { stopImmediatePropagation } from 'handsontable/es/helpers/dom/event';
import BasePlugin from 'handsontable/es/plugins/_base';

/**
 * @plugin CollapsibleColumns
 * @pro
 * @dependencies NestedHeaders HiddenColumns
 *
 * @description
 * The {@link CollapsibleColumns} plugin allows collapsing of columns, covered by a header with the `colspan` property defined.
 *
 * Clicking the "collapse/expand" button collapses (or expands) all "child" headers except the first one.
 *
 * Setting the {@link Options#collapsibleColumns} property to `true` will display a "collapse/expand" button in every header
 * with a defined `colspan` property.
 *
 * To limit this functionality to a smaller group of headers, define the `collapsibleColumns` property as an array
 * of objects, as in the example below.
 *
 * @example
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   data: generateDataObj(),
 *   colHeaders: true,
 *   rowHeaders: true,
 *   // enable plugin
 *   collapsibleColumns: true,
 * });
 *
 * // or
 * const hot = new Handsontable(container, {
 *   data: generateDataObj(),
 *   colHeaders: true,
 *   rowHeaders: true,
 *   // enable and configure which columns can be collapsed
 *   collapsibleColumns: [
 *     {row: -4, col: 1, collapsible: true},
 *     {row: -3, col: 5, collapsible: true}
 *   ],
 * });
 * ```
 */

var CollapsibleColumns = function (_BasePlugin) {
  _inherits(CollapsibleColumns, _BasePlugin);

  function CollapsibleColumns(hotInstance) {
    _classCallCheck(this, CollapsibleColumns);

    /**
     * Cached plugin settings.
     *
     * @private
     * @type {Boolean|Array}
     */
    var _this = _possibleConstructorReturn(this, (CollapsibleColumns.__proto__ || Object.getPrototypeOf(CollapsibleColumns)).call(this, hotInstance));

    _this.settings = null;
    /**
     * Object listing headers with buttons enabled.
     *
     * @private
     * @type {Object}
     */
    _this.buttonEnabledList = {};
    /**
     * Cached reference to the HiddenColumns plugin.
     *
     * @private
     * @type {Object}
     */
    _this.hiddenColumnsPlugin = null;
    /**
     * Cached reference to the NestedHeaders plugin.
     *
     * @private
     * @type {Object}
     */
    _this.nestedHeadersPlugin = null;
    /**
     * Object listing the currently collapsed sections.
     *
     * @private
     * @type {Object}
     */
    _this.collapsedSections = {};
    /**
     * Number of column header levels.
     *
     * @private
     * @type {Number}
     */
    _this.columnHeaderLevelCount = null;
    /**
     * Event manager instance reference.
     *
     * @private
     * @type {EventManager}
     */
    _this.eventManager = null;
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link CollapsibleColumns#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(CollapsibleColumns, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().collapsibleColumns;
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

      this.settings = this.hot.getSettings().collapsibleColumns;

      if (typeof this.settings !== 'boolean') {
        this.parseSettings();
      }

      this.hiddenColumnsPlugin = this.hot.getPlugin('hiddenColumns');
      this.nestedHeadersPlugin = this.hot.getPlugin('nestedHeaders');

      this.checkDependencies();

      this.addHook('afterRender', function () {
        return _this2.onAfterRender();
      });
      this.addHook('afterInit', function () {
        return _this2.onAfterInit();
      });
      this.addHook('afterGetColHeader', function (col, TH) {
        return _this2.onAfterGetColHeader(col, TH);
      });
      this.addHook('beforeOnCellMouseDown', function (event, coords, TD) {
        return _this2.onBeforeOnCellMouseDown(event, coords, TD);
      });

      this.eventManager = new EventManager(this.hot);

      _get(CollapsibleColumns.prototype.__proto__ || Object.getPrototypeOf(CollapsibleColumns.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.settings = null;
      this.buttonEnabledList = {};
      this.hiddenColumnsPlugin = null;
      this.collapsedSections = {};

      this.clearButtons();

      _get(CollapsibleColumns.prototype.__proto__ || Object.getPrototypeOf(CollapsibleColumns.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Clears the expand/collapse buttons.
     *
     * @private
     */

  }, {
    key: 'clearButtons',
    value: function clearButtons() {
      if (!this.hot.view) {
        return;
      }

      var headerLevels = this.hot.view.wt.getSetting('columnHeaders').length;
      var mainHeaders = this.hot.view.wt.wtTable.THEAD;
      var topHeaders = this.hot.view.wt.wtOverlays.topOverlay.clone.wtTable.THEAD;
      var topLeftCornerHeaders = this.hot.view.wt.wtOverlays.topLeftCornerOverlay ? this.hot.view.wt.wtOverlays.topLeftCornerOverlay.clone.wtTable.THEAD : null;

      var removeButton = function removeButton(button) {
        if (button) {
          button.parentNode.removeChild(button);
        }
      };

      rangeEach(0, headerLevels - 1, function (i) {
        var masterLevel = mainHeaders.childNodes[i];
        var topLevel = topHeaders.childNodes[i];
        var topLeftCornerLevel = topLeftCornerHeaders ? topLeftCornerHeaders.childNodes[i] : null;

        rangeEach(0, masterLevel.childNodes.length - 1, function (j) {
          var button = masterLevel.childNodes[j].querySelector('.collapsibleIndicator');

          removeButton(button);

          if (topLevel && topLevel.childNodes[j]) {
            button = topLevel.childNodes[j].querySelector('.collapsibleIndicator');

            removeButton(button);
          }

          if (topLeftCornerHeaders && topLeftCornerLevel && topLeftCornerLevel.childNodes[j]) {
            button = topLeftCornerLevel.childNodes[j].querySelector('.collapsibleIndicator');

            removeButton(button);
          }
        });
      }, true);
    }

    /**
     * Parses the plugin settings and create a button configuration array.
     *
     * @private
     */

  }, {
    key: 'parseSettings',
    value: function parseSettings() {
      var _this3 = this;

      objectEach(this.settings, function (val) {

        if (!_this3.buttonEnabledList[val.row]) {
          _this3.buttonEnabledList[val.row] = {};
        }

        _this3.buttonEnabledList[val.row][val.col] = val.collapsible;
      });
    }

    /**
     * Checks if plugin dependencies are met.
     *
     * @private
     * @returns {Boolean}
     */

  }, {
    key: 'meetsDependencies',
    value: function meetsDependencies() {
      var settings = this.hot.getSettings();

      return settings.nestedHeaders && settings.hiddenColumns;
    }

    /**
     * Checks if all the required dependencies are enabled.
     *
     * @private
     */

  }, {
    key: 'checkDependencies',
    value: function checkDependencies() {
      var settings = this.hot.getSettings();

      if (this.meetsDependencies()) {
        return;
      }

      if (!settings.nestedHeaders) {
        warn('You need to configure the Nested Headers plugin in order to use collapsible headers.');
      }

      if (!settings.hiddenColumns) {
        warn('You need to configure the Hidden Columns plugin in order to use collapsible headers.');
      }
    }

    /**
     * Generates the indicator element.
     *
     * @private
     * @param {Number} column Column index.
     * @param {HTMLElement} TH TH Element.
     * @returns {HTMLElement}
     */

  }, {
    key: 'generateIndicator',
    value: function generateIndicator(column, TH) {
      var TR = TH.parentNode;
      var THEAD = TR.parentNode;
      var row = -1 * THEAD.childNodes.length + Array.prototype.indexOf.call(THEAD.childNodes, TR);

      if (Object.keys(this.buttonEnabledList).length > 0 && (!this.buttonEnabledList[row] || !this.buttonEnabledList[row][column])) {
        return null;
      }

      var divEl = document.createElement('DIV');

      addClass(divEl, 'collapsibleIndicator');

      if (this.collapsedSections[row] && this.collapsedSections[row][column] === true) {
        addClass(divEl, 'collapsed');
        fastInnerText(divEl, '+');
      } else {
        addClass(divEl, 'expanded');
        fastInnerText(divEl, '-');
      }

      return divEl;
    }

    /**
     * Marks (internally) a section as 'collapsed' or 'expanded' (optionally, also mark the 'child' headers).
     *
     * @private
     * @param {String} state State ('collapsed' or 'expanded').
     * @param {Number} row Row index.
     * @param {Number} column Column index.
     * @param {Boolean} recursive If `true`, it will also attempt to mark the child sections.
     */

  }, {
    key: 'markSectionAs',
    value: function markSectionAs(state, row, column, recursive) {
      if (!this.collapsedSections[row]) {
        this.collapsedSections[row] = {};
      }

      switch (state) {
        case 'collapsed':
          this.collapsedSections[row][column] = true;

          break;
        case 'expanded':
          this.collapsedSections[row][column] = void 0;

          break;
        default:
          break;
      }

      if (recursive) {
        var nestedHeadersColspans = this.nestedHeadersPlugin.colspanArray;
        var level = this.nestedHeadersPlugin.rowCoordsToLevel(row);
        var childHeaders = this.nestedHeadersPlugin.getChildHeaders(row, column);
        var childColspanLevel = nestedHeadersColspans[level + 1];

        for (var i = 1; i < childHeaders.length; i++) {
          if (childColspanLevel && childColspanLevel[childHeaders[i]].colspan > 1) {
            this.markSectionAs(state, row + 1, childHeaders[i], true);
          }
        }
      }
    }

    /**
     * Expands section at the provided coords.
     *
     * @param {Object} coords Contains coordinates information. (`coords.row`, `coords.col`)
     */

  }, {
    key: 'expandSection',
    value: function expandSection(coords) {
      this.markSectionAs('expanded', coords.row, coords.col, true);
      this.toggleCollapsibleSection(coords, 'expand');
    }

    /**
     * Collapses section at the provided coords.
     *
     * @param {Object} coords Contains coordinates information. (`coords.row`, `coords.col`)
     */

  }, {
    key: 'collapseSection',
    value: function collapseSection(coords) {
      this.markSectionAs('collapsed', coords.row, coords.col, true);
      this.toggleCollapsibleSection(coords, 'collapse');
    }

    /**
     * Collapses or expand all collapsible sections, depending on the action parameter.
     *
     * @param {String} action 'collapse' or 'expand'.
     */

  }, {
    key: 'toggleAllCollapsibleSections',
    value: function toggleAllCollapsibleSections(action) {
      var _this4 = this;

      var nestedHeadersColspanArray = this.nestedHeadersPlugin.colspanArray;

      if (this.settings === true) {

        arrayEach(nestedHeadersColspanArray, function (headerLevel, i) {
          arrayEach(headerLevel, function (header, j) {
            if (header.colspan > 1) {
              var row = _this4.nestedHeadersPlugin.levelToRowCoords(parseInt(i, 10));
              var col = parseInt(j, 10);

              _this4.markSectionAs(action === 'collapse' ? 'collapsed' : 'expanded', row, col, true);
              _this4.toggleCollapsibleSection({
                row: row,
                col: col
              }, action);
            }
          });
        });
      } else {
        objectEach(this.buttonEnabledList, function (headerRow, i) {
          objectEach(headerRow, function (header, j) {
            var rowIndex = parseInt(i, 10);
            var columnIndex = parseInt(j, 10);

            _this4.markSectionAs(action === 'collapse' ? 'collapsed' : 'expanded', rowIndex, columnIndex, true);
            _this4.toggleCollapsibleSection({
              row: rowIndex,
              col: columnIndex
            }, action);
          });
        });
      }
    }

    /**
     * Collapses all collapsible sections.
     */

  }, {
    key: 'collapseAll',
    value: function collapseAll() {
      this.toggleAllCollapsibleSections('collapse');
    }

    /**
     * Expands all collapsible sections.
     */

  }, {
    key: 'expandAll',
    value: function expandAll() {
      this.toggleAllCollapsibleSections('expand');
    }

    /**
     * Collapses/Expands a section.
     *
     * @param {Object} coords Section coordinates.
     * @param {String} action Action definition ('collapse' or 'expand').
     */

  }, {
    key: 'toggleCollapsibleSection',
    value: function toggleCollapsibleSection(coords, action) {
      var _this5 = this;

      if (coords.row) {
        coords.row = parseInt(coords.row, 10);
      }
      if (coords.col) {
        coords.col = parseInt(coords.col, 10);
      }

      var hiddenColumns = this.hiddenColumnsPlugin.hiddenColumns;
      var colspanArray = this.nestedHeadersPlugin.colspanArray;
      var level = this.nestedHeadersPlugin.rowCoordsToLevel(coords.row);
      var currentHeaderColspan = colspanArray[level][coords.col].colspan;
      var childHeaders = this.nestedHeadersPlugin.getChildHeaders(coords.row, coords.col);
      var nextLevel = level + 1;
      var childColspanLevel = colspanArray[nextLevel];
      var firstChildColspan = childColspanLevel ? childColspanLevel[childHeaders[0]].colspan || 1 : 1;

      while (firstChildColspan === currentHeaderColspan && nextLevel < this.columnHeaderLevelCount) {
        nextLevel += 1;
        childColspanLevel = colspanArray[nextLevel];
        firstChildColspan = childColspanLevel ? childColspanLevel[childHeaders[0]].colspan || 1 : 1;
      }

      rangeEach(firstChildColspan, currentHeaderColspan - 1, function (i) {
        var colToHide = coords.col + i;

        switch (action) {
          case 'collapse':
            if (!_this5.hiddenColumnsPlugin.isHidden(colToHide)) {
              hiddenColumns.push(colToHide);
            }

            break;
          case 'expand':
            if (_this5.hiddenColumnsPlugin.isHidden(colToHide)) {
              hiddenColumns.splice(hiddenColumns.indexOf(colToHide), 1);
            }

            break;
          default:
            break;
        }
      });

      this.hot.render();
      this.hot.view.wt.wtOverlays.adjustElementsSize(true);
    }

    /**
     * Adds the indicator to the headers.
     *
     * @private
     * @param {Number} column Column index.
     * @param {HTMLElement} TH TH element.
     */

  }, {
    key: 'onAfterGetColHeader',
    value: function onAfterGetColHeader(column, TH) {
      if (TH.hasAttribute('colspan') && TH.getAttribute('colspan') > 1 && column >= this.hot.getSettings().fixedColumnsLeft) {
        var button = this.generateIndicator(column, TH);

        if (button !== null) {
          TH.querySelector('div:first-child').appendChild(button);
        }
      }
    }

    /**
     * Indicator mouse event callback.
     *
     * @private
     * @param {Object} event Mouse event.
     * @param {Object} coords Event coordinates.
     */

  }, {
    key: 'onBeforeOnCellMouseDown',
    value: function onBeforeOnCellMouseDown(event, coords) {
      if (hasClass(event.target, 'collapsibleIndicator')) {
        if (hasClass(event.target, 'expanded')) {

          // mark section as collapsed
          if (!this.collapsedSections[coords.row]) {
            this.collapsedSections[coords.row] = [];
          }

          this.markSectionAs('collapsed', coords.row, coords.col, true);
          this.eventManager.fireEvent(event.target, 'mouseup');
          this.toggleCollapsibleSection(coords, 'collapse');
        } else if (hasClass(event.target, 'collapsed')) {

          this.markSectionAs('expanded', coords.row, coords.col, true);
          this.eventManager.fireEvent(event.target, 'mouseup');
          this.toggleCollapsibleSection(coords, 'expand');
        }

        stopImmediatePropagation(event);
        return false;
      }
    }

    /**
     * AfterInit hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterInit',
    value: function onAfterInit() {
      this.columnHeaderLevelCount = this.hot.view.wt.getSetting('columnHeaders').length;
    }

    /**
     * AfterRender hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterRender',
    value: function onAfterRender() {
      if (!this.nestedHeadersPlugin.enabled || !this.hiddenColumnsPlugin.enabled) {
        this.disablePlugin();
      }
    }

    /**
     * Destroys the plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.settings = null;
      this.buttonEnabledList = null;
      this.hiddenColumnsPlugin = null;
      this.nestedHeadersPlugin = null;
      this.collapsedSections = null;
      this.columnHeaderLevelCount = null;

      _get(CollapsibleColumns.prototype.__proto__ || Object.getPrototypeOf(CollapsibleColumns.prototype), 'destroy', this).call(this);
    }
  }]);

  return CollapsibleColumns;
}(BasePlugin);

registerPlugin('collapsibleColumns', CollapsibleColumns);

export default CollapsibleColumns;