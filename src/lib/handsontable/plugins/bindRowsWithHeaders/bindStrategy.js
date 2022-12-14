var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { rangeEach } from 'handsontable/es/helpers/number';
import { toUpperCaseFirst } from 'handsontable/es/helpers/string';
import * as strategies from './bindStrategies';

/**
 * @class BindStrategy
 * @plugin BindRowsWithHeaders
 * @pro
 */

var BindStrategy = function () {
  _createClass(BindStrategy, null, [{
    key: 'DEFAULT_STRATEGY',

    /**
     * Loose bind mode.
     *
     * @returns {String}
     */
    get: function get() {
      return 'loose';
    }
  }]);

  function BindStrategy() {
    _classCallCheck(this, BindStrategy);

    this.strategy = null;
  }

  /**
   * Set strategy behaviors for binding rows with headers.
   *
   * @param name
   */


  _createClass(BindStrategy, [{
    key: 'setStrategy',
    value: function setStrategy(name) {
      var Strategy = strategies[toUpperCaseFirst(name)];

      if (!Strategy) {
        throw new Error('Bind strategy "' + name + '" does not exist.');
      }
      this.strategy = new Strategy();
    }

    /**
     * Reset current map array and create a new one.
     *
     * @param {Number} [length] Custom generated map length.
     */

  }, {
    key: 'createMap',
    value: function createMap(length) {
      var strategy = this.strategy;
      var originLength = length === void 0 ? strategy._arrayMap.length : length;

      strategy._arrayMap.length = 0;

      rangeEach(originLength - 1, function (itemIndex) {
        strategy._arrayMap.push(itemIndex);
      });
    }

    /**
     * Alias for createRow of strategy class.
     *
     * @param {*} params
     */

  }, {
    key: 'createRow',
    value: function createRow() {
      var _strategy;

      (_strategy = this.strategy).createRow.apply(_strategy, arguments);
    }

    /**
     * Alias for removeRow of strategy class.
     *
     * @param {*} params
     */

  }, {
    key: 'removeRow',
    value: function removeRow() {
      var _strategy2;

      (_strategy2 = this.strategy).removeRow.apply(_strategy2, arguments);
    }

    /**
     * Alias for getValueByIndex of strategy class.
     *
     * @param {*} params
     */

  }, {
    key: 'translate',
    value: function translate() {
      var _strategy3;

      return (_strategy3 = this.strategy).getValueByIndex.apply(_strategy3, arguments);
    }

    /**
     * Clear array map.
     */

  }, {
    key: 'clearMap',
    value: function clearMap() {
      this.strategy.clearMap();
    }

    /**
     * Destroy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.strategy) {
        this.strategy.destroy();
      }
      this.strategy = null;
    }
  }]);

  return BindStrategy;
}();

export default BindStrategy;