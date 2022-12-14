var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { addClass, getScrollbarWidth } from 'handsontable/es/helpers/dom/element';
import { clone, extend } from 'handsontable/es/helpers/object';
import { arrayFilter, arrayMap, arrayEach } from 'handsontable/es/helpers/array';
import { isKey } from 'handsontable/es/helpers/unicode';
import { partial } from 'handsontable/es/helpers/function';
import * as C from 'handsontable/es/i18n/constants';
import { stopImmediatePropagation } from 'handsontable/es/helpers/dom/event';
import BaseUI from './_base';
import InputUI from './input';
import LinkUI from './link';
import { createArrayAssertion } from './../utils';

var privatePool = new WeakMap();

/**
 * @class MultipleSelectUI
 * @util
 */

var MultipleSelectUI = function (_BaseUI) {
  _inherits(MultipleSelectUI, _BaseUI);

  _createClass(MultipleSelectUI, null, [{
    key: 'DEFAULTS',
    get: function get() {
      return clone({
        className: 'htUIMultipleSelect',
        value: []
      });
    }
  }]);

  function MultipleSelectUI(hotInstance, options) {
    _classCallCheck(this, MultipleSelectUI);

    var _this = _possibleConstructorReturn(this, (MultipleSelectUI.__proto__ || Object.getPrototypeOf(MultipleSelectUI)).call(this, hotInstance, extend(MultipleSelectUI.DEFAULTS, options)));

    privatePool.set(_this, {});
    /**
     * Input element.
     *
     * @type {InputUI}
     */
    _this.searchInput = new InputUI(_this.hot, {
      placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_SEARCH,
      className: 'htUIMultipleSelectSearch'
    });
    /**
     * "Select all" UI element.
     *
     * @type {BaseUI}
     */
    _this.selectAllUI = new LinkUI(_this.hot, {
      textContent: C.FILTERS_BUTTONS_SELECT_ALL,
      className: 'htUISelectAll'
    });
    /**
     * "Clear" UI element.
     *
     * @type {BaseUI}
     */
    _this.clearAllUI = new LinkUI(_this.hot, {
      textContent: C.FILTERS_BUTTONS_CLEAR,
      className: 'htUIClearAll'
    });
    /**
     * List of available select options.
     *
     * @type {Array}
     */
    _this.items = [];
    /**
     * Handsontable instance used as items list element.
     *
     * @type {Handsontable}
     */
    _this.itemsBox = null;

    _this.registerHooks();
    return _this;
  }

  /**
   * Register all necessary hooks.
   */


  _createClass(MultipleSelectUI, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this;

      this.searchInput.addLocalHook('keydown', function (event) {
        return _this2.onInputKeyDown(event);
      });
      this.searchInput.addLocalHook('input', function (event) {
        return _this2.onInput(event);
      });
      this.selectAllUI.addLocalHook('click', function (event) {
        return _this2.onSelectAllClick(event);
      });
      this.clearAllUI.addLocalHook('click', function (event) {
        return _this2.onClearAllClick(event);
      });
    }

    /**
     * Set available options.
     *
     * @param {Array} items Array of objects with `checked` and `label` property.
     */

  }, {
    key: 'setItems',
    value: function setItems(items) {
      this.items = items;

      if (this.itemsBox) {
        this.itemsBox.loadData(this.items);
      }
    }

    /**
     * Get all available options.
     *
     * @returns {Array}
     */

  }, {
    key: 'getItems',
    value: function getItems() {
      return [].concat(_toConsumableArray(this.items));
    }

    /**
     * Get element value.
     *
     * @returns {Array} Array of selected values.
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return itemsToValue(this.items);
    }

    /**
     * Check if all values listed in element are selected.
     *
     * @returns {Boolean}
     */

  }, {
    key: 'isSelectedAllValues',
    value: function isSelectedAllValues() {
      if (!this.items.length) {
        return true
      }

      return false
      // return this.items.length === this.getValue().length;
    }

    /**
     * Build DOM structure.
     */

  }, {
    key: 'build',
    value: function build() {
      var _this3 = this;

      _get(MultipleSelectUI.prototype.__proto__ || Object.getPrototypeOf(MultipleSelectUI.prototype), 'build', this).call(this);

      var itemsBoxWrapper = document.createElement('div');
      var selectionControl = new BaseUI(this.hot, {
        className: 'htUISelectionControls',
        children: [this.selectAllUI, this.clearAllUI]
      });

      this._element.appendChild(this.searchInput.element);
      this._element.appendChild(selectionControl.element);
      this._element.appendChild(itemsBoxWrapper);

      var hotInitializer = function hotInitializer(wrapper) {
        if (!_this3._element) {
          return;
        }
        if (_this3.itemsBox) {
          _this3.itemsBox.destroy();
        }

        addClass(wrapper, 'htUIMultipleSelectHot');
        // Construct and initialise a new Handsontable
        _this3.itemsBox = new _this3.hot.constructor(wrapper, {
          data: _this3.items,
          columns: [{ data: 'checked', type: 'checkbox', label: { property: 'visualValue', position: 'after' } }],
          beforeRenderer: function beforeRenderer(TD, row, col, prop, value, cellProperties) {
            TD.title = cellProperties.instance.getDataAtRowProp(row, cellProperties.label.property);
          },
          autoWrapCol: true,
          height: 110,
          // Workaround for #151.
          colWidths: function colWidths() {
            return _this3.itemsBox.container.scrollWidth - getScrollbarWidth();
          },
          copyPaste: false,
          disableVisualSelection: 'area',
          fillHandle: false,
          fragmentSelection: 'cell',
          tabMoves: { row: 1, col: 0 },
          beforeKeyDown: function beforeKeyDown(event) {
            return _this3.onItemsBoxBeforeKeyDown(event);
          }
        });
        _this3.itemsBox.init();
      };
      hotInitializer(itemsBoxWrapper);
      setTimeout(function () {
        return hotInitializer(itemsBoxWrapper);
      }, 100);
    }

    /**
     * Reset DOM structure.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.searchInput.reset();
      this.selectAllUI.reset();
      this.clearAllUI.reset();
    }

    /**
     * Update DOM structure.
     */

  }, {
    key: 'update',
    value: function update() {
      if (!this.isBuilt()) {
        return;
      }

      this.itemsBox.loadData(valueToItems(this.items, this.options.value));
      _get(MultipleSelectUI.prototype.__proto__ || Object.getPrototypeOf(MultipleSelectUI.prototype), 'update', this).call(this);
    }

    /**
     * Destroy instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.itemsBox) {
        this.itemsBox.destroy();
      }
      this.searchInput.destroy();
      this.clearAllUI.destroy();
      this.selectAllUI.destroy();

      this.searchInput = null;
      this.clearAllUI = null;
      this.selectAllUI = null;
      this.itemsBox = null;
      this.items = null;
      _get(MultipleSelectUI.prototype.__proto__ || Object.getPrototypeOf(MultipleSelectUI.prototype), 'destroy', this).call(this);
    }

    /**
     * 'input' event listener for input element.
     *
     * @private
     * @param {Event} event DOM event.
     */

  }, {
    key: 'onInput',
    value: function onInput(event) {
      var value = event.target.value.toLowerCase();
      var filteredItems = void 0;

      if (value === '') {
        filteredItems = [].concat(_toConsumableArray(this.items));
      } else {
        filteredItems = arrayFilter(this.items, function (item) {
          return ('' + item.value).toLowerCase().indexOf(value) >= 0;
        });
      }
      this.itemsBox.loadData(filteredItems);
    }

    /**
     * 'keydown' event listener for input element.
     *
     * @private
     * @param {Event} event DOM event.
     */

  }, {
    key: 'onInputKeyDown',
    value: function onInputKeyDown(event) {
      this.runLocalHooks('keydown', event, this);

      var isKeyCode = partial(isKey, event.keyCode);

      if (isKeyCode('ARROW_DOWN|TAB') && !this.itemsBox.isListening()) {
        stopImmediatePropagation(event);
        this.itemsBox.listen();
        this.itemsBox.selectCell(0, 0);
      }
    }

    /**
     * On before key down listener (internal Handsontable).
     *
     * @private
     * @param {Event} event DOM event.
     */

  }, {
    key: 'onItemsBoxBeforeKeyDown',
    value: function onItemsBoxBeforeKeyDown(event) {
      var isKeyCode = partial(isKey, event.keyCode);

      if (isKeyCode('ESCAPE')) {
        this.runLocalHooks('keydown', event, this);
      }
      // for keys different than below, unfocus Handsontable and focus search input
      if (!isKeyCode('ARROW_UP|ARROW_DOWN|ARROW_LEFT|ARROW_RIGHT|TAB|SPACE|ENTER')) {
        stopImmediatePropagation(event);
        this.itemsBox.unlisten();
        this.itemsBox.deselectCell();
        this.searchInput.focus();
      }
    }

    /**
     * On click listener for "Select all" link.
     *
     * @private
     * @param {DOMEvent} event
     */

  }, {
    key: 'onSelectAllClick',
    value: function onSelectAllClick(event) {
      event.preventDefault();
      arrayEach(this.itemsBox.getSourceData(), function (row) {
        row.checked = true;
      });
      this.itemsBox.render();
    }

    /**
     * On click listener for "Clear" link.
     *
     * @private
     * @param {DOMEvent} event
     */

  }, {
    key: 'onClearAllClick',
    value: function onClearAllClick(event) {
      event.preventDefault();
      arrayEach(this.itemsBox.getSourceData(), function (row) {
        row.checked = false;
      });
      this.itemsBox.render();
    }
  }]);

  return MultipleSelectUI;
}(BaseUI);

export default MultipleSelectUI;

/**
 * Pick up object items based on selected values.
 *
 * @param {Array} availableItems Base collection to compare values.
 * @param selectedValue Flat array with selected values.
 * @returns {Array}
 */
function valueToItems(availableItems, selectedValue) {
  var arrayAssertion = createArrayAssertion(selectedValue);

  return arrayMap(availableItems, function (item) {
    item.checked = arrayAssertion(item.value);

    return item;
  });
}

/**
 * Convert all checked items into flat array.
 *
 * @param {Array} availableItems Base collection.
 * @returns {Array}
 */
function itemsToValue(availableItems) {
  var items = [];

  arrayEach(availableItems, function (item) {
    if (item.checked) {
      items.push(item.value);
    }
  });

  return items;
}