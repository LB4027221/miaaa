var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { rangeEach } from 'handsontable/es/helpers/number';
import { arrayEach } from 'handsontable/es/helpers/array';
import * as C from 'handsontable/es/i18n/constants';
import BaseUI from './_base';

var privatePool = new WeakMap();

/**
 * Class responsible for the Context Menu entries for the Nested Rows plugin.
 *
 * @class ContextMenuUI
 * @util
 * @extends BaseUI
 */

var ContextMenuUI = function (_BaseUI) {
  _inherits(ContextMenuUI, _BaseUI);

  function ContextMenuUI(nestedRowsPlugin, hotInstance) {
    _classCallCheck(this, ContextMenuUI);

    var _this = _possibleConstructorReturn(this, (ContextMenuUI.__proto__ || Object.getPrototypeOf(ContextMenuUI)).call(this, nestedRowsPlugin, hotInstance));

    privatePool.set(_this, {
      row_above: function row_above(key, selection) {
        _this.dataManager.addSibling(selection.start.row, 'above');
      },
      row_below: function row_below(key, selection) {
        _this.dataManager.addSibling(selection.start.row, 'below');
      }
    });
    /**
     * Reference to the DataManager instance connected with the Nested Rows plugin.
     *
     * @type {DataManager}
     */
    _this.dataManager = _this.plugin.dataManager;
    return _this;
  }
  /**
   * Append options to the context menu. (Propagated from the `afterContextMenuDefaultOptions` hook callback)
   * f
   * @private
   * @param {Object} defaultOptions Default context menu options.
   * @returns {*}
   */


  _createClass(ContextMenuUI, [{
    key: 'appendOptions',
    value: function appendOptions(defaultOptions) {
      var _this2 = this;

      var newEntries = [{
        key: 'add_child',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD);
        },

        callback: function callback() {
          var translatedRowIndex = _this2.dataManager.translateTrimmedRow(_this2.hot.getSelectedLast()[0]);
          var parent = _this2.dataManager.getDataObject(translatedRowIndex);
          _this2.dataManager.addChild(parent);
        },
        disabled: function disabled() {
          var selected = _this2.hot.getSelectedLast();

          return !selected || selected[0] < 0 || _this2.hot.selection.isSelectedByColumnHeader() || _this2.hot.countRows() >= _this2.hot.getSettings().maxRows;
        }
      }, {
        key: 'detach_from_parent',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD);
        },

        callback: function callback() {
          _this2.dataManager.detachFromParent(_this2.hot.getSelectedLast());
        },
        disabled: function disabled() {
          var selected = _this2.hot.getSelectedLast();
          var translatedRowIndex = _this2.dataManager.translateTrimmedRow(selected[0]);
          var parent = _this2.dataManager.getRowParent(translatedRowIndex);

          return !parent || !selected || selected[0] < 0 || _this2.hot.selection.isSelectedByColumnHeader() || _this2.hot.countRows() >= _this2.hot.getSettings().maxRows;
        }
      }, {
        name: '---------'
      }];

      rangeEach(0, defaultOptions.items.length - 1, function (i) {
        if (i === 0) {
          arrayEach(newEntries, function (val, j) {
            defaultOptions.items.splice(i + j, 0, val);
          });

          return false;
        }
      });

      return this.modifyRowInsertingOptions(defaultOptions);
    }

    /**
     * Modify how the row inserting options work.
     *
     * @private
     * @param {Object} defaultOptions Default context menu items.
     * @returns {*}
     */

  }, {
    key: 'modifyRowInsertingOptions',
    value: function modifyRowInsertingOptions(defaultOptions) {
      var priv = privatePool.get(this);

      rangeEach(0, defaultOptions.items.length - 1, function (i) {
        var option = priv[defaultOptions.items[i].key];

        if (option !== null && option !== void 0) {
          defaultOptions.items[i].callback = option;
        }
      });

      return defaultOptions;
    }
  }]);

  return ContextMenuUI;
}(BaseUI);

export default ContextMenuUI;