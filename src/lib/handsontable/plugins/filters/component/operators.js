var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['Radio button with index ', ' doesn\'t exist.'], ['Radio button with index ', ' doesn\'t exist.']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { addClass } from 'handsontable/es/helpers/dom/element';
import { arrayEach } from 'handsontable/es/helpers/array';
import { toSingleLine } from 'handsontable/es/helpers/templateLiteralTag';
import BaseComponent from './_base';
import { getOperationName } from '../logicalOperationRegisterer';
import { OPERATION_ID as OPERATION_AND } from '../logicalOperations/conjunction';
import { OPERATION_ID as OPERATION_OR } from '../logicalOperations/disjunction';
import { OPERATION_ID as OPERATION_OR_THEN_VARIABLE } from '../logicalOperations/disjunctionWithExtraCondition';
import RadioInputUI from './../ui/radioInput';

var SELECTED_AT_START_ELEMENT_INDEX = 0;

/**
 * @class OperatorsComponent
 * @plugin Filters
 */

var OperatorsComponent = function (_BaseComponent) {
  _inherits(OperatorsComponent, _BaseComponent);

  function OperatorsComponent(hotInstance, options) {
    _classCallCheck(this, OperatorsComponent);

    var _this = _possibleConstructorReturn(this, (OperatorsComponent.__proto__ || Object.getPrototypeOf(OperatorsComponent)).call(this, hotInstance));

    _this.id = options.id;
    _this.name = options.name;

    _this.buildOperatorsElement();
    return _this;
  }

  /**
   * Get menu object descriptor.
   *
   * @returns {Object}
   */


  _createClass(OperatorsComponent, [{
    key: 'getMenuItemDescriptor',
    value: function getMenuItemDescriptor() {
      var _this2 = this;

      return {
        key: this.id,
        name: this.name,
        isCommand: false,
        disableSelection: true,
        hidden: function hidden() {
          return _this2.isHidden();
        },
        renderer: function renderer(hot, wrapper) {
          addClass(wrapper.parentNode, 'htFiltersMenuOperators');

          if (!wrapper.parentNode.hasAttribute('ghost-table')) {
            arrayEach(_this2.elements, function (ui) {
              return wrapper.appendChild(ui.element);
            });
          }

          return wrapper;
        }
      };
    }

    /**
     * Add RadioInputUI elements to component
     *
     * @private
     */

  }, {
    key: 'buildOperatorsElement',
    value: function buildOperatorsElement() {
      var _this3 = this;

      var operationKeys = [OPERATION_AND, OPERATION_OR];

      arrayEach(operationKeys, function (operation) {
        var radioInput = new RadioInputUI(_this3.hot, {
          name: 'operator',
          label: {
            htmlFor: operation,
            textContent: getOperationName(operation)
          },
          value: operation,
          checked: operation === operationKeys[SELECTED_AT_START_ELEMENT_INDEX],
          id: operation
        });

        radioInput.addLocalHook('change', function (event) {
          return _this3.onRadioInputChange(event);
        });
        _this3.elements.push(radioInput);
      });
    }

    /**
     * Set state of operators component to check radio input at specific `index`.
     *
     * @param searchedIndex Index of radio input to check.
     */

  }, {
    key: 'setChecked',
    value: function setChecked(searchedIndex) {
      if (this.elements.length < searchedIndex) {
        throw Error(toSingleLine(_templateObject, searchedIndex));
      }

      arrayEach(this.elements, function (element, index) {
        element.setChecked(index === searchedIndex);
      });
    }

    /**
     * Get `id` of active operator
     *
     * @returns {String}
     */

  }, {
    key: 'getActiveOperationId',
    value: function getActiveOperationId() {
      var operationElement = this.elements.find(function (element) {
        return element instanceof RadioInputUI && element.isChecked();
      });

      if (operationElement) {
        return operationElement.getValue();
      }

      return OPERATION_AND;
    }

    /**
     * Export state of the component (get selected operator).
     *
     * @returns {String} Returns `id` of selected operator.
     */

  }, {
    key: 'getState',
    value: function getState() {
      return this.getActiveOperationId();
    }

    /**
     * Set state of the component.
     *
     * @param {Object} value State to restore.
     */

  }, {
    key: 'setState',
    value: function setState(value) {
      this.reset();

      if (value && this.getActiveOperationId() !== value) {
        arrayEach(this.elements, function (element) {
          element.setChecked(element.getValue() === value);
        });
      }
    }

    /**
     * Update state of component.
     * @param [operationId='conjunction'] Id of selected operation.
     * @param column Physical column index.
     */

  }, {
    key: 'updateState',
    value: function updateState() {
      var operationId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : OPERATION_AND;
      var column = arguments[1];

      var selectedOperationId = operationId;

      if (selectedOperationId === OPERATION_OR_THEN_VARIABLE) {
        selectedOperationId = OPERATION_OR;
      }

      this.setCachedState(column, selectedOperationId);
    }

    /**
     * Reset elements to their initial state.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.setChecked(SELECTED_AT_START_ELEMENT_INDEX);
    }

    /**
     * OnChange listener.
     *
     * @private
     * @param {Event} event DOM event
     */

  }, {
    key: 'onRadioInputChange',
    value: function onRadioInputChange(event) {
      this.setState(event.realTarget.value);
    }
  }]);

  return OperatorsComponent;
}(BaseComponent);

export default OperatorsComponent;