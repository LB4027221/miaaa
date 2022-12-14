var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import arrayMapper from 'handsontable/es/mixins/arrayMapper';
import { mixin } from 'handsontable/es/helpers/object';

/**
 * @private
 * @class LooseBindStrategy
 */

var LooseBindStrategy = function () {
  function LooseBindStrategy() {
    _classCallCheck(this, LooseBindStrategy);
  }

  _createClass(LooseBindStrategy, [{
    key: 'createRow',


    /**
     * Strategy for the create row action.
     *
     * @param {Number} index Row index.
     * @param {Number} amount
     */
    value: function createRow(index, amount) {
      this.shiftItems(index, amount);
    }

    /**
     * Strategy for the remove row action.
     *
     * @param {Number|Array} index Row index or Array of row indexes.
     * @param {Number} amount
     */

  }, {
    key: 'removeRow',
    value: function removeRow(index, amount) {
      this.unshiftItems(index, amount);
    }

    /**
     * Destroy strategy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._arrayMap = null;
    }
  }], [{
    key: 'STRATEGY_NAME',

    /**
     * Loose bind mode.
     *
     * @returns {String}
     */
    get: function get() {
      return 'loose';
    }
  }]);

  return LooseBindStrategy;
}();

mixin(LooseBindStrategy, arrayMapper);

export default LooseBindStrategy;