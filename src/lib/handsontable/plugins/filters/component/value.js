var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { addClass } from 'handsontable/es/helpers/dom/element';
import { stopImmediatePropagation } from 'handsontable/es/helpers/dom/event';
import { arrayEach, arrayFilter, arrayMap } from 'handsontable/es/helpers/array';
import { isKey } from 'handsontable/es/helpers/unicode';
import * as C from 'handsontable/es/i18n/constants';
import { unifyColumnValues, intersectValues, toEmptyString } from './../utils';
import BaseComponent from './_base';
import MultipleSelectUI from './../ui/multipleSelect';
import { CONDITION_BY_VALUE, CONDITION_NONE } from './../constants';
import { getConditionDescriptor } from './../conditionRegisterer';

/**
 * @class ValueComponent
 * @plugin Filters
 */

var ValueComponent = function (_BaseComponent) {
  _inherits(ValueComponent, _BaseComponent);

  function ValueComponent(hotInstance, options) {
    _classCallCheck(this, ValueComponent);

    var _this = _possibleConstructorReturn(this, (ValueComponent.__proto__ || Object.getPrototypeOf(ValueComponent)).call(this, hotInstance));

    _this.id = options.id;
    _this.name = options.name;

    _this.elements.push(new MultipleSelectUI(_this.hot));

    _this.registerHooks();
    return _this;
  }

  /**
   * Register all necessary hooks.
   *
   * @private
   */


  _createClass(ValueComponent, [{
    key: 'registerHooks',
    value: function registerHooks() {
      var _this2 = this;

      this.getMultipleSelectElement().addLocalHook('keydown', function (event) {
        return _this2.onInputKeyDown(event);
      });
    }

    /**
     * Set state of the component.
     *
     * @param {Object} value
     */

  }, {
    key: 'setState',
    value: function setState(value) {
      this.reset();

      if (value && value.command.key === CONDITION_BY_VALUE) {
        var select = this.getMultipleSelectElement();

        select.setItems(value.itemsSnapshot);
        select.setValue(value.args[0]);
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
      var select = this.getMultipleSelectElement();
      var availableItems = select.getItems();

      return {
        command: { key: select.isSelectedAllValues() || !availableItems.length ? CONDITION_NONE : CONDITION_BY_VALUE },
        args: [select.getValue()],
        itemsSnapshot: availableItems
      };
    }

    /**
     * Update state of component.
     *
     * @param {Object} stateInfo Information about state containing stack of edited column,
     * stack of dependent conditions, data factory and optional condition arguments change. It's described by object containing keys:
     * `editedConditionStack`, `dependentConditionStacks`, `visibleDataFactory` and `conditionArgsChange`.
     */

  }, {
    key: 'updateState',
    value: function updateState(stateInfo) {
      var _this3 = this;

      var updateColumnState = function updateColumnState(column, conditions, conditionArgsChange, filteredRowsFactory, conditionsStack) {
        var _arrayFilter = arrayFilter(conditions, function (condition) {
          return condition.name === CONDITION_BY_VALUE;
        }),
            _arrayFilter2 = _slicedToArray(_arrayFilter, 1),
            firstByValueCondition = _arrayFilter2[0];

        var state = {};
        var defaultBlankCellValue = _this3.hot.getTranslatedPhrase(C.FILTERS_VALUES_BLANK_CELLS);

        if (firstByValueCondition) {
          var rowValues = arrayMap(filteredRowsFactory(column, conditionsStack), function (row) {
            return row.value;
          });

          rowValues = unifyColumnValues(rowValues);

          if (conditionArgsChange) {
            firstByValueCondition.args[0] = conditionArgsChange;
          }

          var selectedValues = [];
          var itemsSnapshot = intersectValues(rowValues, firstByValueCondition.args[0], defaultBlankCellValue, function (item) {
            if (item.checked) {
              selectedValues.push(item.value);
            }
          });

          state.args = [selectedValues];
          state.command = getConditionDescriptor(CONDITION_BY_VALUE);
          state.itemsSnapshot = itemsSnapshot;
        } else {
          state.args = [];
          state.command = getConditionDescriptor(CONDITION_NONE);
        }

        _this3.setCachedState(column, state);
      };

      updateColumnState(stateInfo.editedConditionStack.column, stateInfo.editedConditionStack.conditions, stateInfo.conditionArgsChange, stateInfo.filteredRowsFactory);

      // Shallow deep update of component state
      if (stateInfo.dependentConditionStacks.length) {
        updateColumnState(stateInfo.dependentConditionStacks[0].column, stateInfo.dependentConditionStacks[0].conditions, stateInfo.conditionArgsChange, stateInfo.filteredRowsFactory, stateInfo.editedConditionStack);
      }
    }

    /**
     * Get multiple select element.
     *
     * @returns {MultipleSelectUI}
     */

  }, {
    key: 'getMultipleSelectElement',
    value: function getMultipleSelectElement() {
      return this.elements.filter(function (element) {
        return element instanceof MultipleSelectUI;
      })[0];
    }

    /**
     * Get object descriptor for menu item entry.
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
          addClass(wrapper.parentNode, 'htFiltersMenuValue');

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
      var defaultBlankCellValue = this.hot.getTranslatedPhrase(C.FILTERS_VALUES_BLANK_CELLS);
      var values = unifyColumnValues(this._getColumnVisibleValues());
      var items = intersectValues(values, values, defaultBlankCellValue);

      this.getMultipleSelectElement().setItems(items);
      _get(ValueComponent.prototype.__proto__ || Object.getPrototypeOf(ValueComponent.prototype), 'reset', this).call(this);
      this.getMultipleSelectElement().setValue(values);
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
      if (isKey(event.keyCode, 'ESCAPE')) {
        this.runLocalHooks('cancel');
        stopImmediatePropagation(event);
      }
    }

    /**
     * Get data for currently selected column.
     *
     * @returns {Array}
     * @private
     */

  }, {
    key: '_getColumnVisibleValues',
    value: function _getColumnVisibleValues() {
      var lastSelectedColumn = this.hot.getPlugin('filters').getSelectedColumn();
      var visualIndex = lastSelectedColumn && lastSelectedColumn.visualIndex;

      return arrayMap(this.hot.getDataAtCol(visualIndex), function (v) {
        return toEmptyString(v);
      });
    }
  }]);

  return ValueComponent;
}(BaseComponent);

export default ValueComponent;