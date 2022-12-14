var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { toLabel } from '../formula-parser';
import BaseCell from './_base';

/**
 * Class which indicates formula expression precedents cells at specified cell
 * coordinates (CellValue). This object uses visual cell coordinates.
 *
 * @class CellReference
 * @util
 */

var CellReference = function (_BaseCell) {
  _inherits(CellReference, _BaseCell);

  function CellReference() {
    _classCallCheck(this, CellReference);

    return _possibleConstructorReturn(this, (CellReference.__proto__ || Object.getPrototypeOf(CellReference)).apply(this, arguments));
  }

  _createClass(CellReference, [{
    key: 'toString',

    /**
     * Stringify object.
     *
     * @returns {String}
     */
    value: function toString() {
      return toLabel({ index: this.row, isAbsolute: false }, { index: this.column, isAbsolute: false });
    }
  }]);

  return CellReference;
}(BaseCell);

export default CellReference;