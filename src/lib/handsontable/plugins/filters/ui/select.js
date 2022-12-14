var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Menu from 'handsontable/es/plugins/contextMenu/menu';
import { clone, extend } from 'handsontable/es/helpers/object';
import { arrayEach } from 'handsontable/es/helpers/array';
import * as C from 'handsontable/es/i18n/constants';
import { SEPARATOR } from 'handsontable/es/plugins/contextMenu/predefinedItems';
import BaseUI from './_base';

var privatePool = new WeakMap();

/**
 * @class SelectUI
 * @util
 */

var SelectUI = function (_BaseUI) {
  _inherits(SelectUI, _BaseUI);

  _createClass(SelectUI, null, [{
    key: 'DEFAULTS',
    get: function get() {
      return clone({
        className: 'htUISelect',
        wrapIt: false
      });
    }
  }]);

  function SelectUI(hotInstance, options) {
    _classCallCheck(this, SelectUI);

    var _this = _possibleConstructorReturn(this, (SelectUI.__proto__ || Object.getPrototypeOf(SelectUI)).call(this, hotInstance, extend(SelectUI.DEFAULTS, options)));

    privatePool.set(_this, {});
    /**
     * Instance of {@link Menu}.
     *
     * @type {Menu}
     */
    _this.menu = null;
    /**
     * List of available select options.
     *
     * @type {Array}
     */
    _this.items = [];

    _this.registerHooks();
    return _this;
  }

  /**
   * Register all necessary hooks.
   */


  _createClass(SelectUI, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this;

      this.addLocalHook('click', function () {
        return _this2.onClick();
      });
    }

    /**
     * Set options which can be selected in the list.
     *
     * @param {Array} items Array of objects with required keys `key` and `name`.
     */

  }, {
    key: 'setItems',
    value: function setItems(items) {
      this.items = this.translateNames(items);

      if (this.menu) {
        this.menu.setMenuItems(this.items);
      }
    }

    /**
     * Translate names of menu items.
     *
     * @param {Array} items Array of objects with required keys `key` and `name`.
     * @returns {Array} Items with translated `name` keys.
     */

  }, {
    key: 'translateNames',
    value: function translateNames(items) {
      var _this3 = this;

      arrayEach(items, function (item) {
        item.name = _this3.translateIfPossible(item.name);
      });

      return items;
    }

    /**
     * Build DOM structure.
     */

  }, {
    key: 'build',
    value: function build() {
      var _this4 = this;

      _get(SelectUI.prototype.__proto__ || Object.getPrototypeOf(SelectUI.prototype), 'build', this).call(this);
      this.menu = new Menu(this.hot, {
        className: 'htSelectUI htFiltersConditionsMenu',
        keepInViewport: false,
        standalone: true
      });
      this.menu.setMenuItems(this.items);

      var caption = new BaseUI(this.hot, {
        className: 'htUISelectCaption'
      });
      var dropdown = new BaseUI(this.hot, {
        className: 'htUISelectDropdown'
      });
      var priv = privatePool.get(this);

      priv.caption = caption;
      priv.captionElement = caption.element;
      priv.dropdown = dropdown;

      arrayEach([caption, dropdown], function (element) {
        return _this4._element.appendChild(element.element);
      });

      this.menu.addLocalHook('select', function (command) {
        return _this4.onMenuSelect(command);
      });
      this.menu.addLocalHook('afterClose', function () {
        return _this4.onMenuClosed();
      });
      this.update();
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

      var conditionName = void 0;

      if (this.options.value) {
        conditionName = this.options.value.name;
      } else {
        conditionName = this.menu.hot.getTranslatedPhrase(C.FILTERS_CONDITIONS_NONE);
      }

      privatePool.get(this).captionElement.textContent = conditionName;
      _get(SelectUI.prototype.__proto__ || Object.getPrototypeOf(SelectUI.prototype), 'update', this).call(this);
    }

    /**
     * Open select dropdown menu with available options.
     */

  }, {
    key: 'openOptions',
    value: function openOptions() {
      var rect = this.element.getBoundingClientRect();

      if (this.menu) {
        this.menu.open();
        this.menu.setPosition({
          left: rect.left - 5,
          top: rect.top,
          width: rect.width,
          height: rect.height
        });
      }
    }

    /**
     * Close select dropdown menu.
     */

  }, {
    key: 'closeOptions',
    value: function closeOptions() {
      if (this.menu) {
        this.menu.close();
      }
    }

    /**
     * On menu selected listener.
     *
     * @private
     * @param {Object} command Selected item
     */

  }, {
    key: 'onMenuSelect',
    value: function onMenuSelect(command) {
      if (command.name !== SEPARATOR) {
        this.options.value = command;
        this.closeOptions();
        this.update();
        this.runLocalHooks('select', this.options.value);
      }
    }

    /**
     * On menu closed listener.
     *
     * @private
     */

  }, {
    key: 'onMenuClosed',
    value: function onMenuClosed() {
      this.runLocalHooks('afterClose');
    }

    /**
     * On element click listener.
     *
     * @private
     */

  }, {
    key: 'onClick',
    value: function onClick() {
      this.openOptions();
    }

    /**
     * Destroy instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.menu) {
        this.menu.destroy();
        this.menu = null;
      }

      var _privatePool$get = privatePool.get(this),
          caption = _privatePool$get.caption,
          dropdown = _privatePool$get.dropdown;

      if (caption) {
        caption.destroy();
      }
      if (dropdown) {
        dropdown.destroy();
      }

      _get(SelectUI.prototype.__proto__ || Object.getPrototypeOf(SelectUI.prototype), 'destroy', this).call(this);
    }
  }]);

  return SelectUI;
}(BaseUI);

export default SelectUI;