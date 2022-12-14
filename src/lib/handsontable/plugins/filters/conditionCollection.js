var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['The column of index ', ' has been already applied with a `', '` \n        filter operation. Use `removeConditions` to clear the current conditions and then add new ones. \n        Mind that you cannot mix different types of operations (for instance, if you use `conjunction`, \n        use it consequently for a particular column).'], ['The column of index ', ' has been already applied with a \\`', '\\` \n        filter operation. Use \\`removeConditions\\` to clear the current conditions and then add new ones. \n        Mind that you cannot mix different types of operations (for instance, if you use \\`conjunction\\`, \n        use it consequently for a particular column).']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { arrayEach, arrayMap, arrayFilter } from 'handsontable/es/helpers/array';
import { objectEach, mixin } from 'handsontable/es/helpers/object';
import { toSingleLine } from 'handsontable/es/helpers/templateLiteralTag';
import localHooks from 'handsontable/es/mixins/localHooks';
import { getCondition } from './conditionRegisterer';
import { OPERATION_ID as OPERATION_AND } from './logicalOperations/conjunction';
import { operations, getOperationFunc } from './logicalOperationRegisterer';

/**
 * @class ConditionCollection
 * @plugin Filters
 */

var ConditionCollection = function () {
  function ConditionCollection() {
    _classCallCheck(this, ConditionCollection);

    /**
     * Conditions collection grouped by operation type and then column index.
     *
     * @type {Object}
     */
    this.conditions = this.initConditionsCollection();

    /**
     * Types of operations grouped by column index.
     *
     * @type {Object}
     */
    this.columnTypes = {};

    /**
     * Order of added condition filters.
     *
     * @type {Array}
     */
    this.orderStack = [];
  }

  /**
   * Check if condition collection is empty (so no needed to filter data).
   *
   * @returns {Boolean}
   */


  _createClass(ConditionCollection, [{
    key: 'isEmpty',
    value: function isEmpty() {
      return !this.orderStack.length;
    }

    /**
     * Check if value is matched to the criteria of conditions chain.
     *
     * @param {Object} value Object with `value` and `meta` keys.
     * @param {Number} [column] Column index.
     * @returns {Boolean}
     */

  }, {
    key: 'isMatch',
    value: function isMatch(value, column) {
      var _this = this;

      var result = true;

      if (column === void 0) {
        objectEach(this.columnTypes, function (columnType, columnIndex) {
          result = _this.isMatchInConditions(_this.conditions[columnType][columnIndex], value, columnType);

          return result;
        });
      } else {
        var columnType = this.columnTypes[column];

        result = this.isMatchInConditions(this.getConditions(column), value, columnType);
      }

      return result;
    }

    /**
     * Check if the value is matches the conditions.
     *
     * @param {Array} conditions List of conditions.
     * @param {Object} value Object with `value` and `meta` keys.
     * @param {String} [operationType='conjunction'] Type of conditions operation
     * @returns {Boolean}
     */

  }, {
    key: 'isMatchInConditions',
    value: function isMatchInConditions(conditions, value) {
      var operationType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : OPERATION_AND;

      var result = false;

      if (conditions.length) {
        result = getOperationFunc(operationType)(conditions, value);
      } else {
        result = true;
      }

      return result;
    }

    /**
     * Add condition to the collection.
     *
     * @param {Number} column Column index.
     * @param {Object} conditionDefinition Object with keys:
     *  * `command` Object, Command object with condition name as `key` property.
     *  * `args` Array, Condition arguments.
     * @param {String} [operation='conjunction'] Type of conditions operation
     * @fires ConditionCollection#beforeAdd
     * @fires ConditionCollection#afterAdd
     */

  }, {
    key: 'addCondition',
    value: function addCondition(column, conditionDefinition) {
      var operation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : OPERATION_AND;

      var args = arrayMap(conditionDefinition.args, function (v) {
        return typeof v === 'string' ? v.toLowerCase() : v;
      });
      var name = conditionDefinition.name || conditionDefinition.command.key;

      this.runLocalHooks('beforeAdd', column);

      if (this.orderStack.indexOf(column) === -1) {
        this.orderStack.push(column);
      }

      var columnType = this.columnTypes[column];

      if (columnType) {
        if (columnType !== operation) {
          throw Error(toSingleLine(_templateObject, column, columnType));
        }
      } else {
        if (!this.conditions[operation]) {
          throw new Error('Unexpected operation named `' + operation + '`. Possible ones are `disjunction` and `conjunction`.');
        }

        this.columnTypes[column] = operation;
      }

      // Add condition
      this.getConditions(column).push({
        name: name,
        args: args,
        func: getCondition(name, args)
      });

      this.runLocalHooks('afterAdd', column);
    }

    /**
     * Get all added conditions from the collection at specified column index.
     *
     * @param {Number} column Column index.
     * @returns {Array} Returns conditions collection as an array.
     */

  }, {
    key: 'getConditions',
    value: function getConditions(column) {
      var columnType = this.columnTypes[column];

      if (!columnType) {
        return [];
      }

      if (!this.conditions[columnType][column]) {
        this.conditions[columnType][column] = [];
      }

      return this.conditions[columnType][column];
    }

    /**
     * Export all previously added conditions.
     *
     * @returns {Array}
     */

  }, {
    key: 'exportAllConditions',
    value: function exportAllConditions() {
      var _this2 = this;

      var result = [];

      arrayEach(this.orderStack, function (column) {
        var conditions = arrayMap(_this2.getConditions(column), function (_ref) {
          var name = _ref.name,
              args = _ref.args;
          return { name: name, args: args };
        });
        var operation = _this2.columnTypes[column];

        result.push({
          column: column,
          operation: operation,
          conditions: conditions
        });
      });

      return result;
    }

    /**
     * Import conditions to the collection.
     */

  }, {
    key: 'importAllConditions',
    value: function importAllConditions(conditions) {
      var _this3 = this;

      this.clean();

      arrayEach(conditions, function (stack) {
        _this3.orderStack.push(stack.column);

        arrayEach(stack.conditions, function (condition) {
          return _this3.addCondition(stack.column, condition);
        });
      });
    }

    /**
     * Remove conditions at given column index.
     *
     * @param {Number} column Column index.
     * @fires ConditionCollection#beforeRemove
     * @fires ConditionCollection#afterRemove
     */

  }, {
    key: 'removeConditions',
    value: function removeConditions(column) {
      this.runLocalHooks('beforeRemove', column);

      if (this.orderStack.indexOf(column) >= 0) {
        this.orderStack.splice(this.orderStack.indexOf(column), 1);
      }
      this.clearConditions(column);
      this.runLocalHooks('afterRemove', column);
    }

    /**
     * Clear conditions at specified column index but without clearing stack order.
     *
     * @param {Number }column Column index.
     * @fires ConditionCollection#beforeClear
     * @fires ConditionCollection#afterClear
     */

  }, {
    key: 'clearConditions',
    value: function clearConditions(column) {
      this.runLocalHooks('beforeClear', column);
      this.getConditions(column).length = 0;
      delete this.columnTypes[column];
      this.runLocalHooks('afterClear', column);
    }

    /**
     * Check if at least one condition was added at specified column index. And if second parameter is passed then additionally
     * check if condition exists under its name.
     *
     * @param {Number} column Column index.
     * @param {String} [name] Condition name.
     * @returns {Boolean}
     */

  }, {
    key: 'hasConditions',
    value: function hasConditions(column, name) {
      var columnType = this.columnTypes[column];
      var result = false;

      if (!columnType) {
        return false;
      }

      var conditions = this.getConditions(column);
      if (name) {
        result = arrayFilter(conditions, function (condition) {
          return condition.name === name;
        }).length > 0;
      } else {
        result = conditions.length > 0;
      }

      return result;
    }

    /**
     * Clean all conditions collection and reset order stack.
     *
     * @fires ConditionCollection#beforeClean
     * @fires ConditionCollection#afterClean
     */

  }, {
    key: 'clean',
    value: function clean() {
      this.runLocalHooks('beforeClean');
      this.columnTypes = Object.create(null);
      this.orderStack.length = 0;
      this.conditions = this.initConditionsCollection();
      this.runLocalHooks('afterClean');
    }

    /**
     * Destroy object.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.clearLocalHooks();
      this.conditions = null;
      this.orderStack = null;
      this.columnTypes = null;
    }

    /**
     * Init conditions collection
     *
     * @private
     */

  }, {
    key: 'initConditionsCollection',
    value: function initConditionsCollection() {
      var conditions = Object.create(null);

      objectEach(operations, function (_, operation) {
        conditions[operation] = Object.create(null);
      });

      return conditions;
    }
  }]);

  return ConditionCollection;
}();

mixin(ConditionCollection, localHooks);

export default ConditionCollection;