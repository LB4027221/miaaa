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
import getOptionsList, { CONDITION_NONE } from './../constants';
import InputUI from './../ui/input';
import SelectUI from './../ui/select';
import { getConditionDescriptor } from './../conditionRegisterer';

/**
 * @class ConditionComponent
 * @plugin Filters
 */

var ConditionComponent = function (_BaseComponent) {
  _inherits(ConditionComponent, _BaseComponent);

  function ConditionComponent(hotInstance, options) {
    _classCallCheck(this, ConditionComponent);

    var _this = _possibleConstructorReturn(this, (ConditionComponent.__proto__ || Object.getPrototypeOf(ConditionComponent)).call(this, hotInstance));

    _this.id = options.id;
    _this.name = options.name;
    _this.addSeparator = options.addSeparator;

    _this.elements.push(new SelectUI(_this.hot));
    _this.elements.push(new InputUI(_this.hot, { placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_VALUE }));
    _this.elements.push(new InputUI(_this.hot, { placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE }));
    _this.registerHooks();
    return _this;
  }

  /**
   * Register all necessary hooks.
   *
   * @private
   */


  _createClass(ConditionComponent, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this;

      this.getSelectElement().addLocalHook('select', function (command) {
        return _this2.onConditionSelect(command);
      });
      this.getSelectElement().addLocalHook('afterClose', function () {
        return _this2.onSelectUIClosed();
      });

      arrayEach(this.getInputElements(), function (input) {
        input.addLocalHook('keydown', function (event) {
          return _this2.onInputKeyDown(event);
        });
      });
    }

    /**
     * Set state of the component.
     *
     * @param {Object} value State to restore.
     */

  }, {
    key: 'setState',
    value: function setState(value) {
      var _this3 = this;

      this.reset();

      if (value) {
        var copyOfCommand = clone(value.command);

        if (copyOfCommand.name.startsWith(C.FILTERS_CONDITIONS_NAMESPACE)) {
          copyOfCommand.name = this.hot.getTranslatedPhrase(copyOfCommand.name);
        }

        this.getSelectElement().setValue(copyOfCommand);
        arrayEach(value.args, function (arg, index) {
          if (index > copyOfCommand.inputsCount - 1) {
            return false;
          }

          var element = _this3.getInputElement(index);

          element.setValue(arg);
          element[copyOfCommand.inputsCount > index ? 'show' : 'hide']();

          if (!index) {
            setTimeout(function () {
              return element.focus();
            }, 10);
          }
        });
      }
    }

    /**
     * Export state of the component (get selected filter and filter arguments).
     *
     * @returns {Object} Returns object where `command` key keeps used condition filter and `args` key its arguments.
     */

  }, {
    key: 'getState',
    value: function getState() {
      var command = this.getSelectElement().getValue() || getConditionDescriptor(CONDITION_NONE);
      var args = [];

      arrayEach(this.getInputElements(), function (element, index) {
        if (command.inputsCount > index) {
          args.push(element.getValue());
        }
      });

      return {
        command: command,
        args: args
      };
    }

    /**
     * Update state of component.
     * @param {Object} condition Object with keys:
     *  * `command` Object, Command object with condition name as `key` property.
     *  * `args` Array, Condition arguments.
     * @param column Physical column index.
     */

  }, {
    key: 'updateState',
    value: function updateState(condition, column) {
      var command = condition ? getConditionDescriptor(condition.name) : getConditionDescriptor(CONDITION_NONE);

      this.setCachedState(column, {
        command: command,
        args: condition ? condition.args : []
      });

      if (!condition) {
        arrayEach(this.getInputElements(), function (element) {
          return element.setValue(null);
        });
      }
    }

    /**
     * Get select element.
     *
     * @returns {SelectUI}
     */

  }, {
    key: 'getSelectElement',
    value: function getSelectElement() {
      return this.elements.filter(function (element) {
        return element instanceof SelectUI;
      })[0];
    }

    /**
     * Get input element.
     *
     * @param {Number} index Index an array of elements.
     * @returns {InputUI}
     */

  }, {
    key: 'getInputElement',
    value: function getInputElement() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return this.getInputElements()[index];
    }

    /**
     * Get input elements.
     *
     * @returns {Array}
     */

  }, {
    key: 'getInputElements',
    value: function getInputElements() {
      return this.elements.filter(function (element) {
        return element instanceof InputUI;
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
      var _this4 = this;

      return {
        key: this.id,
        name: this.name,
        isCommand: false,
        disableSelection: true,
        hidden: function hidden() {
          return _this4.isHidden();
        },
        renderer: function renderer(hot, wrapper, row, col, prop, value) {
          addClass(wrapper.parentNode, 'htFiltersMenuCondition');

          if (_this4.addSeparator) {
            addClass(wrapper.parentNode, 'border');
          }

          var label = document.createElement('div');

          addClass(label, 'htFiltersMenuLabel');

          label.textContent = value;

          wrapper.appendChild(label);

          if (!wrapper.parentNode.hasAttribute('ghost-table')) {
            arrayEach(_this4.elements, function (ui) {
              return wrapper.appendChild(ui.element);
            });
          }

          return wrapper;
        }
      };
    }

    /**
     * Reset elements to their initial state.
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _hot;

      var lastSelectedColumn = this.hot.getPlugin('filters').getSelectedColumn();
      var visualIndex = lastSelectedColumn && lastSelectedColumn.visualIndex;
      var columnType = (_hot = this.hot).getDataType.apply(_hot, _toConsumableArray(this.hot.getSelectedLast() || [0, visualIndex]));
      var items = getOptionsList(columnType);

      arrayEach(this.getInputElements(), function (element) {
        return element.hide();
      });
      this.getSelectElement().setItems(items);
      _get(ConditionComponent.prototype.__proto__ || Object.getPrototypeOf(ConditionComponent.prototype), 'reset', this).call(this);
      // Select element as default 'None'
      this.getSelectElement().setValue(items[0]);
    }

    /**
     * On condition select listener.
     *
     * @private
     * @param {Object} command Menu item object (command).
     */

  }, {
    key: 'onConditionSelect',
    value: function onConditionSelect(command) {
      arrayEach(this.getInputElements(), function (element, index) {
        element[command.inputsCount > index ? 'show' : 'hide']();

        if (!index) {
          setTimeout(function () {
            return element.focus();
          }, 10);
        }
      });

      this.runLocalHooks('change', command);
    }

    /**
     * On component SelectUI closed listener.
     *
     * @private
     */

  }, {
    key: 'onSelectUIClosed',
    value: function onSelectUIClosed() {
      this.runLocalHooks('afterClose');
    }

    /**
     * Key down listener.
     *
     * @private
     * @param {Event} event DOM event object.
     */

  }, {
    key: 'onInputKeyDown',
    value: function onInputKeyDown(event) {
      if (isKey(event.keyCode, 'ENTER')) {
        this.runLocalHooks('accept');
        stopImmediatePropagation(event);
      } else if (isKey(event.keyCode, 'ESCAPE')) {
        this.runLocalHooks('cancel');
        stopImmediatePropagation(event);
      }
    }
  }]);

  return ConditionComponent;
}(BaseComponent);

export default ConditionComponent;