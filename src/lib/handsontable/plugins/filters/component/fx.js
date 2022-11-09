/* eslint-disable */
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { addClass } from 'handsontable/es/helpers/dom/element';
import { stopImmediatePropagation } from 'handsontable/es/helpers/dom/event';
import { arrayEach } from 'handsontable/es/helpers/array';
import { isKey } from 'handsontable/es/helpers/unicode';
import { clone } from 'handsontable/es/helpers/object';
import * as C from 'handsontable/es/i18n/constants';
import BaseComponent from './_base';
import InputUI from './../ui/fx';

var ConditionComponent = function (_BaseComponent) {
  _inherits(ConditionComponent, _BaseComponent)

  function ConditionComponent(hotInstance, options) {
    _classCallCheck(this, ConditionComponent)

    var _this = _possibleConstructorReturn(this, (ConditionComponent.__proto__ || Object.getPrototypeOf(ConditionComponent)).call(this, hotInstance))

    _this.id = options.id
    _this.name = options.name
    _this.addSeparator = options.addSeparator

    _this.elements.push(new InputUI(_this.hot, { placeholder: '设置函数' }))
    _this.registerHooks()
    return _this
  }


  _createClass(ConditionComponent, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this
    }
  }, {
    key: 'getMenuItemDescriptor',
    value: function getMenuItemDescriptor() {
      var _this3 = this;

      return {
        key: this.id,
        name: this.name,
        isCommand: false,
        disableSelection: true,
        hidden: function hidden() {
          return _this3.isHidden();
        },
        renderer: function renderer(hot, wrapper) {
          addClass(wrapper.parentNode, 'htFiltersMenuActionBar');

          if (!wrapper.parentNode.hasAttribute('ghost-table')) {
            arrayEach(_this3.elements, function (ui) {
              return wrapper.appendChild(ui.element);
            });
          }

          return wrapper;
        }
      };
    }

    /**
     * Fire accept event.
     */

  }, {
    key: 'accept',
    value: function accept() {
      this.runLocalHooks('accept');
    }

    /**
     * Fire cancel event.
     */

  }, {
    key: 'cancel',
    value: function cancel() {
      this.runLocalHooks('cancel');
    }

    /**
     * On button click listener.
     *
     * @private
     * @param {Event} event DOM event
     * @param {InputUI} button InputUI object.
     */

  }, {
    key: 'onButtonClick',
    value: function onButtonClick(event, button) {
      if (button.options.identifier === ActionBarComponent.BUTTON_OK) {
        this.accept();
      } else {
        this.cancel();
      }
    }
  }]);

  return ConditionComponent
}(BaseComponent)

export default ConditionComponent