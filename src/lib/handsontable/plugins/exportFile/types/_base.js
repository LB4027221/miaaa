var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { extend, clone } from 'handsontable/es/helpers/object';
import { substitute } from 'handsontable/es/helpers/string';

/**
 * @plugin ExportFile
 * @private
 */

var BaseType = function () {
  _createClass(BaseType, null, [{
    key: 'DEFAULT_OPTIONS',

    /**
     * Default options.
     *
     * @returns {Object}
     */
    get: function get() {
      return {
        mimeType: 'text/plain',
        fileExtension: 'txt',
        filename: 'Handsontable [YYYY]-[MM]-[DD]',
        encoding: 'utf-8',
        bom: false,
        columnHeaders: false,
        rowHeaders: false,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        range: []
      };
    }
  }]);

  function BaseType(dataProvider, options) {
    _classCallCheck(this, BaseType);

    /**
     * Data provider.
     *
     * @type {DataProvider}
     */
    this.dataProvider = dataProvider;
    /**
     * Format type class options.
     *
     * @type {Object}
     */
    this.options = this._mergeOptions(options);

    this.dataProvider.setOptions(this.options);
  }

  /**
   * Merge options provided by users with defaults.
   *
   * @return {Object} Returns new options object.
   */


  _createClass(BaseType, [{
    key: '_mergeOptions',
    value: function _mergeOptions(options) {
      var _options = clone(this.constructor.DEFAULT_OPTIONS);
      var date = new Date();

      _options = extend(clone(BaseType.DEFAULT_OPTIONS), _options);
      _options = extend(_options, options);

      _options.filename = substitute(_options.filename, {
        YYYY: date.getFullYear(),
        MM: ('' + (date.getMonth() + 1)).padStart(2, '0'),
        DD: ('' + date.getDate()).padStart(2, '0')
      });

      return _options;
    }
  }]);

  return BaseType;
}();

export default BaseType;