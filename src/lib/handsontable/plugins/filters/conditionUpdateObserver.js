var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { arrayEach, arrayMap, arrayFilter } from 'handsontable/es/helpers/array';
import { mixin, objectEach } from 'handsontable/es/helpers/object';
import { curry } from 'handsontable/es/helpers/function';
import localHooks from 'handsontable/es/mixins/localHooks';
import ConditionCollection from './conditionCollection';
import DataFilter from './dataFilter';
import { createArrayAssertion } from './utils';

/**
 * Class which is designed for observing changes in condition collection. When condition is changed by user at specified
 * column it's necessary to update all conditions defined after this edited one.
 *
 * Object fires `update` hook for every column conditions change.
 *
 * @class ConditionUpdateObserver
 * @plugin Filters
 * @pro
 */

var ConditionUpdateObserver = function () {
  function ConditionUpdateObserver(conditionCollection) {
    var _this = this;

    var columnDataFactory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return [];
    };

    _classCallCheck(this, ConditionUpdateObserver);

    /**
     * Reference to the instance of {@link ConditionCollection}.
     *
     * @type {ConditionCollection}
     */
    this.conditionCollection = conditionCollection;
    /**
     * Function which provide source data factory for specified column.
     *
     * @type {Function}
     */
    this.columnDataFactory = columnDataFactory;
    /**
     * Collected changes when grouping is enabled.
     *
     * @type {Array}
     * @default []
     */
    this.changes = [];
    /**
     * Flag which determines if grouping events is enabled.
     *
     * @type {Boolean}
     */
    this.grouping = false;
    /**
     * The latest known position of edited conditions at specified column index.
     *
     * @type {Number}
     * @default -1
     */
    this.latestEditedColumnPosition = -1;
    /**
     * The latest known order of conditions stack.
     *
     * @type {Array}
     */
    this.latestOrderStack = [];

    this.conditionCollection.addLocalHook('beforeRemove', function (column) {
      return _this._onConditionBeforeModify(column);
    });
    this.conditionCollection.addLocalHook('afterAdd', function (column) {
      return _this.updateStatesAtColumn(column);
    });
    this.conditionCollection.addLocalHook('afterClear', function (column) {
      return _this.updateStatesAtColumn(column);
    });
    this.conditionCollection.addLocalHook('beforeClean', function () {
      return _this._onConditionBeforeClean();
    });
    this.conditionCollection.addLocalHook('afterClean', function () {
      return _this._onConditionAfterClean();
    });
  }

  /**
   * Enable grouping changes. Grouping is helpful in situations when a lot of conditions is added in one moment. Instead of
   * trigger `update` hook for every condition by adding/removing you can group this changes and call `flush` method to trigger
   * it once.
   */


  _createClass(ConditionUpdateObserver, [{
    key: 'groupChanges',
    value: function groupChanges() {
      this.grouping = true;
    }

    /**
     * Flush all collected changes. This trigger `update` hook for every previously collected change from condition collection.
     */

  }, {
    key: 'flush',
    value: function flush() {
      var _this2 = this;

      this.grouping = false;

      arrayEach(this.changes, function (column) {
        _this2.updateStatesAtColumn(column);
      });
      this.changes.length = 0;
    }

    /**
     * On before modify condition (add or remove from collection),
     *
     * @param {Number} column Column index.
     * @private
     */

  }, {
    key: '_onConditionBeforeModify',
    value: function _onConditionBeforeModify(column) {
      this.latestEditedColumnPosition = this.conditionCollection.orderStack.indexOf(column);
    }

    /**
     * Update all related states which should be changed after invoking changes applied to current column.
     *
     * @param column
     * @param {Object} conditionArgsChange Object describing condition changes which can be handled by filters on `update` hook.
     * It contains keys `conditionKey` and `conditionValue` which refers to change specified key of condition to specified value
     * based on referred keys.
     */

  }, {
    key: 'updateStatesAtColumn',
    value: function updateStatesAtColumn(column, conditionArgsChange) {
      var _this3 = this;

      if (this.grouping) {
        if (this.changes.indexOf(column) === -1) {
          this.changes.push(column);
        }

        return;
      }
      var allConditions = this.conditionCollection.exportAllConditions();
      var editedColumnPosition = this.conditionCollection.orderStack.indexOf(column);

      if (editedColumnPosition === -1) {
        editedColumnPosition = this.latestEditedColumnPosition;
      }

      // Collection of all conditions defined before currently edited `column` (without edited one)
      var conditionsBefore = allConditions.slice(0, editedColumnPosition);
      // Collection of all conditions defined after currently edited `column` (without edited one)
      var conditionsAfter = allConditions.slice(editedColumnPosition);

      // Make sure that conditionAfter doesn't contain edited column conditions
      if (conditionsAfter.length && conditionsAfter[0].column === column) {
        conditionsAfter.shift();
      }

      var visibleDataFactory = curry(function (curriedConditionsBefore, curriedColumn) {
        var conditionsStack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var splitConditionCollection = new ConditionCollection();
        var curriedConditionsBeforeArray = [].concat(curriedConditionsBefore, conditionsStack);

        // Create new condition collection to determine what rows should be visible in "filter by value" box in the next conditions in the chain
        splitConditionCollection.importAllConditions(curriedConditionsBeforeArray);

        var allRows = _this3.columnDataFactory(curriedColumn);
        var visibleRows = void 0;

        if (splitConditionCollection.isEmpty()) {
          visibleRows = allRows;
        } else {
          visibleRows = new DataFilter(splitConditionCollection, function (columnData) {
            return _this3.columnDataFactory(columnData);
          }).filter();
        }
        visibleRows = arrayMap(visibleRows, function (rowData) {
          return rowData.meta.visualRow;
        });

        var visibleRowsAssertion = createArrayAssertion(visibleRows);

        return arrayFilter(allRows, function (rowData) {
          return visibleRowsAssertion(rowData.meta.visualRow);
        });
      })(conditionsBefore);

      var editedConditions = [].concat(this.conditionCollection.getConditions(column));

      this.runLocalHooks('update', {
        editedConditionStack: { column: column, conditions: editedConditions },
        dependentConditionStacks: conditionsAfter,
        filteredRowsFactory: visibleDataFactory,
        conditionArgsChange: conditionArgsChange
      });
    }

    /**
     * On before conditions clean listener.
     *
     * @private
     */

  }, {
    key: '_onConditionBeforeClean',
    value: function _onConditionBeforeClean() {
      this.latestOrderStack = [].concat(this.conditionCollection.orderStack);
    }

    /**
     * On after conditions clean listener.
     *
     * @private
     */

  }, {
    key: '_onConditionAfterClean',
    value: function _onConditionAfterClean() {
      var _this4 = this;

      arrayEach(this.latestOrderStack, function (column) {
        _this4.updateStatesAtColumn(column);
      });
    }

    /**
     * Destroy instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this.clearLocalHooks();

      objectEach(this, function (value, property) {
        _this5[property] = null;
      });
    }
  }]);

  return ConditionUpdateObserver;
}();

mixin(ConditionUpdateObserver, localHooks);

export default ConditionUpdateObserver;