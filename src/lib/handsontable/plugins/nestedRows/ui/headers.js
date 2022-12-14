var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { arrayEach } from 'handsontable/es/helpers/array';
import { rangeEach } from 'handsontable/es/helpers/number';
import { addClass } from 'handsontable/es/helpers/dom/element';
import BaseUI from './_base';

/**
 * Class responsible for the UI in the Nested Rows' row headers.
 *
 * @class HeadersUI
 * @util
 * @extends BaseUI
 */

var HeadersUI = function (_BaseUI) {
  _inherits(HeadersUI, _BaseUI);

  _createClass(HeadersUI, null, [{
    key: 'CSS_CLASSES',

    /**
     * CSS classes used in the row headers.
     *
     * @type {Object}
     */
    get: function get() {
      return {
        indicatorContainer: 'ht_nestingLevels',
        parent: 'ht_nestingParent',
        indicator: 'ht_nestingLevel',
        emptyIndicator: 'ht_nestingLevel_empty',
        button: 'ht_nestingButton',
        expandButton: 'ht_nestingExpand',
        collapseButton: 'ht_nestingCollapse'
      };
    }
  }]);

  function HeadersUI(nestedRowsPlugin, hotInstance) {
    _classCallCheck(this, HeadersUI);

    /**
     * Reference to the DataManager instance connected with the Nested Rows plugin.
     *
     * @type {DataManager}
     */
    var _this = _possibleConstructorReturn(this, (HeadersUI.__proto__ || Object.getPrototypeOf(HeadersUI)).call(this, nestedRowsPlugin, hotInstance));

    _this.dataManager = _this.plugin.dataManager;
    // /**
    //  * Level cache array.
    //  *
    //  * @type {Array}
    //  */
    // this.levelCache = this.dataManager.cache.levels;
    /**
     * Reference to the CollapsingUI instance connected with the Nested Rows plugin.
     *
     * @type {CollapsingUI}
     */
    _this.collapsingUI = _this.plugin.collapsingUI;
    /**
     * Cache for the row headers width.
     *
     * @type {null|Number}
     */
    _this.rowHeaderWidthCache = null;
    /**
     * Reference to the TrimRows instance connected with the Nested Rows plugin.
     *
     * @type {TrimRows}
     */
    _this.trimRowsPlugin = nestedRowsPlugin.trimRowsPlugin;
    return _this;
  }

  /**
   * Append nesting indicators and buttons to the row headers.
   *
   * @private
   * @param {Number} row Row index.
   * @param {HTMLElement} TH TH 3element.
   */


  _createClass(HeadersUI, [{
    key: 'appendLevelIndicators',
    value: function appendLevelIndicators(row, TH) {
      var rowIndex = this.trimRowsPlugin.rowsMapper.getValueByIndex(row);
      var rowLevel = this.dataManager.getRowLevel(rowIndex);
      var rowObject = this.dataManager.getDataObject(rowIndex);
      var innerDiv = TH.getElementsByTagName('DIV')[0];
      var innerSpan = innerDiv.querySelector('span.rowHeader');
      var previousIndicators = innerDiv.querySelectorAll('[class^="ht_nesting"]');

      arrayEach(previousIndicators, function (elem) {
        if (elem) {
          innerDiv.removeChild(elem);
        }
      });

      addClass(TH, HeadersUI.CSS_CLASSES.indicatorContainer);

      if (rowLevel) {
        var initialContent = innerSpan.cloneNode(true);
        innerDiv.innerHTML = '';

        rangeEach(0, rowLevel - 1, function () {
          var levelIndicator = document.createElement('SPAN');
          addClass(levelIndicator, HeadersUI.CSS_CLASSES.emptyIndicator);
          innerDiv.appendChild(levelIndicator);
        });

        innerDiv.appendChild(initialContent);
      }

      if (this.dataManager.hasChildren(rowObject)) {
        var buttonsContainer = document.createElement('DIV');
        addClass(TH, HeadersUI.CSS_CLASSES.parent);

        if (this.collapsingUI.areChildrenCollapsed(rowIndex)) {
          addClass(buttonsContainer, HeadersUI.CSS_CLASSES.button + ' ' + HeadersUI.CSS_CLASSES.expandButton);
        } else {
          addClass(buttonsContainer, HeadersUI.CSS_CLASSES.button + ' ' + HeadersUI.CSS_CLASSES.collapseButton);
        }

        innerDiv.appendChild(buttonsContainer);
      }
    }

    /**
     * Update the row header width according to number of levels in the dataset.
     *
     * @private
     * @param {Number} deepestLevel Cached deepest level of nesting.
     */

  }, {
    key: 'updateRowHeaderWidth',
    value: function updateRowHeaderWidth(deepestLevel) {
      var deepestLevelIndex = deepestLevel;

      if (!deepestLevelIndex) {
        deepestLevelIndex = this.dataManager.cache.levelCount;
      }

      this.rowHeaderWidthCache = Math.max(50, 11 + 10 * deepestLevelIndex + 25);

      this.hot.render();
    }
  }]);

  return HeadersUI;
}(BaseUI);

export default HeadersUI;