var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { addClass } from 'handsontable/es/helpers/dom/element';
import { arrayEach } from 'handsontable/es/helpers/array';
import * as C from 'handsontable/es/i18n/constants';
import BaseComponent from './_base';
import InputUI from './../ui/input';

/**
 * @class ActionBarComponent
 * @plugin Filters
 */

var ActionBarComponent = function (_BaseComponent) {
  _inherits(ActionBarComponent, _BaseComponent);

  _createClass(ActionBarComponent, null, [{
    key: 'BUTTON_OK',
    get: function get() {
      return 'ok';
    }
  }, {
    key: 'BUTTON_CANCEL',
    get: function get() {
      return 'cancel';
    }
  }]);

  function ActionBarComponent(hotInstance, options) {
    _classCallCheck(this, ActionBarComponent);

    var _this = _possibleConstructorReturn(this, (ActionBarComponent.__proto__ || Object.getPrototypeOf(ActionBarComponent)).call(this, hotInstance));

    _this.id = options.id;
    _this.name = options.name;

    _this.elements.push(new InputUI(_this.hot, {
      type: 'button',
      value: C.FILTERS_BUTTONS_OK,
      className: 'htUIButton htUIButtonOK',
      identifier: ActionBarComponent.BUTTON_OK
    }));
    _this.elements.push(new InputUI(_this.hot, {
      type: 'button',
      value: C.FILTERS_BUTTONS_CANCEL,
      className: 'htUIButton htUIButtonCancel',
      identifier: ActionBarComponent.BUTTON_CANCEL
    }));
    _this.registerHooks();
    return _this;
  }

  /**
   * Register all necessary hooks.
   *
   * @private
   */


  _createClass(ActionBarComponent, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this;

      arrayEach(this.elements, function (element) {
        element.addLocalHook('click', function (event, button) {
          return _this2.onButtonClick(event, button);
        });
      });
    }

    /**
     * Get menu object descriptor.
     *
     * @returns {Object}
     */

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

  return ActionBarComponent;
}(BaseComponent);

export default ActionBarComponent;