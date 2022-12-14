var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import arrayMapper from 'handsontable/es/mixins/arrayMapper';
import { mixin } from 'handsontable/es/helpers/object';
import { rangeEach } from 'handsontable/es/helpers/number';

/**
 * @class RowsMapper
 * @plugin TrimRows
 * @pro
 */

var RowsMapper = function () {
  function RowsMapper(trimRows) {
    _classCallCheck(this, RowsMapper);

    /**
     * Instance of TrimRows plugin.
     *
     * @type {TrimRows}
     */
    this.trimRows = trimRows;
  }

  /**
   * Reset current map array and create new one.
   *
   * @param {Number} [length] Custom generated map length.
   */


  _createClass(RowsMapper, [{
    key: 'createMap',
    value: function createMap(length) {
      var _this = this;

      var rowOffset = 0;
      var originLength = length === void 0 ? this._arrayMap.length : length;

      this._arrayMap.length = 0;

      rangeEach(originLength - 1, function (itemIndex) {
        if (_this.trimRows.isTrimmed(itemIndex)) {
          rowOffset += 1;
        } else {
          _this._arrayMap[itemIndex - rowOffset] = itemIndex;
        }
      });
    }

    /**
     * Destroy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._arrayMap = null;
    }
  }]);

  return RowsMapper;
}();

mixin(RowsMapper, arrayMapper);

export default RowsMapper;