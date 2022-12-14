var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { addClass } from 'handsontable/es/helpers/dom/element';
import { clone, extend } from 'handsontable/es/helpers/object';
import BaseUI from './_base';

var privatePool = new WeakMap();

/**
 * @class InputUI
 * @util
 */

var InputUI = function (_BaseUI) {
  _inherits(InputUI, _BaseUI);

  _createClass(InputUI, null, [{
    key: 'DEFAULTS',
    get: function get() {
      return clone({
        placeholder: '',
        type: 'text',
        tagName: 'input'
      });
    }
  }]);

  function InputUI(hotInstance, options) {
    _classCallCheck(this, InputUI);

    var _this = _possibleConstructorReturn(this, (InputUI.__proto__ || Object.getPrototypeOf(InputUI)).call(this, hotInstance, extend(InputUI.DEFAULTS, options)));

    privatePool.set(_this, {});
    _this.registerHooks();
    return _this;
  }

  /**
   * Register all necessary hooks.
   */


  _createClass(InputUI, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this;

      this.addLocalHook('click', function () {
        return _this2.onClick();
      });
      this.addLocalHook('keyup', function (event) {
        return _this2.onKeyup(event);
      });
    }

    /**
     * Build DOM structure.
     */

  }, {
    key: 'build',
    value: function build() {
      _get(InputUI.prototype.__proto__ || Object.getPrototypeOf(InputUI.prototype), 'build', this).call(this);
      var priv = privatePool.get(this);
      var icon = document.createElement('div');

      priv.input = this._element.firstChild;

      addClass(this._element, 'htUIInput');
      addClass(icon, 'htUIInputIcon');

      this._element.appendChild(icon);

      this.update();
    }

    /**
     * Update element.
     */

  }, {
    key: 'update',
    value: function update() {
      if (!this.isBuilt()) {
        return;
      }

      var input = privatePool.get(this).input;

      input.type = this.options.type;
      input.placeholder = this.translateIfPossible(this.options.placeholder);
      input.value = this.translateIfPossible(this.options.value);
    }

    /**
     * Focus element.
     */

  }, {
    key: 'focus',
    value: function focus() {
      if (this.isBuilt()) {
        privatePool.get(this).input.focus();
      }
    }

    /**
     * OnClick listener.
     */

  }, {
    key: 'onClick',
    value: function onClick() {}

    /**
     * OnKeyup listener.
     *
     * @param {Event} event
     */

  }, {
    key: 'onKeyup',
    value: function onKeyup(event) {
      this.options.value = event.target.value;
    }
  }]);

  return InputUI;
}(BaseUI);

export default InputUI;