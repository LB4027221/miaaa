var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { arrayEach, arrayMap } from 'handsontable/es/helpers/array';
import { stringify } from 'handsontable/es/helpers/mixed';
import BaseType from './_base.js';

var CHAR_CARRIAGE_RETURN = String.fromCharCode(13);
var CHAR_DOUBLE_QUOTES = String.fromCharCode(34);
var CHAR_LINE_FEED = String.fromCharCode(10);

/**
 * @plugin ExportFile
 * @private
 */

var Csv = function (_BaseType) {
  _inherits(Csv, _BaseType);

  function Csv() {
    _classCallCheck(this, Csv);

    return _possibleConstructorReturn(this, (Csv.__proto__ || Object.getPrototypeOf(Csv)).apply(this, arguments));
  }

  _createClass(Csv, [{
    key: 'export',


    /**
     * Create string body in desired format.
     *
     * @return {String}
    */
    value: function _export() {
      var _this2 = this;

      var options = this.options;
      var data = this.dataProvider.getData();
      var columnHeaders = this.dataProvider.getColumnHeaders();
      var hasColumnHeaders = columnHeaders.length > 0;
      var rowHeaders = this.dataProvider.getRowHeaders();
      var hasRowHeaders = rowHeaders.length > 0;
      var result = options.bom ? String.fromCharCode(0xFEFF) : '';

      if (hasColumnHeaders) {
        columnHeaders = arrayMap(columnHeaders, function (value) {
          return _this2._escapeCell(value, true);
        });

        if (hasRowHeaders) {
          result += options.columnDelimiter;
        }
        result += columnHeaders.join(options.columnDelimiter);
        result += options.rowDelimiter;
      }

      arrayEach(data, function (value, index) {
        if (index > 0) {
          result += options.rowDelimiter;
        }
        if (hasRowHeaders) {
          result += _this2._escapeCell(rowHeaders[index]) + options.columnDelimiter;
        }
        result += value.map(function (cellValue) {
          return _this2._escapeCell(cellValue);
        }).join(options.columnDelimiter);
      });

      return result;
    }

    /**
     * Escape cell value.
     *
     * @param {*} value Cell value.
     * @param {Boolean} [force=false] Indicates if cell value will be escaped forcefully.
     * @return {String}
     */

  }, {
    key: '_escapeCell',
    value: function _escapeCell(value) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var escapedValue = stringify(value);

      if (escapedValue !== '' && (force || escapedValue.indexOf(CHAR_CARRIAGE_RETURN) >= 0 || escapedValue.indexOf(CHAR_DOUBLE_QUOTES) >= 0 || escapedValue.indexOf(CHAR_LINE_FEED) >= 0 || escapedValue.indexOf(this.options.columnDelimiter) >= 0)) {

        escapedValue = escapedValue.replace(new RegExp('"', 'g'), '""');
        escapedValue = '"' + escapedValue + '"';
      }

      return escapedValue;
    }
  }], [{
    key: 'DEFAULT_OPTIONS',

    /**
     * Default options for exporting CSV format.
     *
     * @returns {Object}
     */
    get: function get() {
      return {
        mimeType: 'text/csv',
        fileExtension: 'csv',
        bom: true,
        columnDelimiter: ',',
        rowDelimiter: '\r\n'
      };
    }
  }]);

  return Csv;
}(BaseType);

export default Csv;