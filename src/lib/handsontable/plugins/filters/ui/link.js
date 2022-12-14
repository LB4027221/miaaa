var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { clone, extend } from 'handsontable/es/helpers/object';
import BaseUI from './_base';

var privatePool = new WeakMap();

/**
 * @class LinkUI
 * @util
 */

var LinkUI = function (_BaseUI) {
  _inherits(LinkUI, _BaseUI);

  _createClass(LinkUI, null, [{
    key: 'DEFAULTS',
    get: function get() {
      return clone({
        href: '#',
        tagName: 'a'
      });
    }
  }]);

  function LinkUI(hotInstance, options) {
    _classCallCheck(this, LinkUI);

    var _this = _possibleConstructorReturn(this, (LinkUI.__proto__ || Object.getPrototypeOf(LinkUI)).call(this, hotInstance, extend(LinkUI.DEFAULTS, options)));

    privatePool.set(_this, {});
    return _this;
  }

  /**
   * Build DOM structure.
   */


  _createClass(LinkUI, [{
    key: 'build',
    value: function build() {
      _get(LinkUI.prototype.__proto__ || Object.getPrototypeOf(LinkUI.prototype), 'build', this).call(this);

      var priv = privatePool.get(this);

      priv.link = this._element.firstChild;
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

      privatePool.get(this).link.textContent = this.translateIfPossible(this.options.textContent);
    }
  }]);

  return LinkUI;
}(BaseUI);

export default LinkUI;