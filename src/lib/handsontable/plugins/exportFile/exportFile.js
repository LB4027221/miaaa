var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base';
import { registerPlugin } from 'handsontable/es/plugins';
import DataProvider from './dataProvider';
import typeFactory, { EXPORT_TYPES } from './typeFactory';

/**
 * @plugin ExportFile
 * @pro
 *
 * @description
 * The plugin enables exporting table data to file. It allows to export data as a string, blob or a downloadable file in
 * CSV format.
 *
 * See [the export file demo](https://docs.handsontable.com/demo-export-file.html) for examples.
 *
 * @example
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   data: getData()
 * });
 *
 * // access to exportFile plugin instance
 * const exportPlugin = hot.getPlugin('exportFile');
 *
 * // export as a string
 * exportPlugin.exportAsString('csv');
 *
 * // export as a blob object
 * exportPlugin.exportAsBlob('csv');
 *
 * // export to downloadable file (named: MyFile.csv)
 * exportPlugin.downloadFile('csv', {filename: 'MyFile'});
 *
 * // export as a string (with specified data range):
 * exportPlugin.exportAsString('csv', {
 *   exportHiddenRows: true,     // default false
 *   exportHiddenColumns: true,  // default false
 *   columnHeaders: true,        // default false
 *   rowHeaders: true,           // default false
 *   columnDelimiter: ';',       // default ','
 *   range: [1, 1, 6, 6]         // [startRow, endRow, startColumn, endColumn]
 * });
 * ```
 */

var ExportFile = function (_BasePlugin) {
  _inherits(ExportFile, _BasePlugin);

  function ExportFile() {
    _classCallCheck(this, ExportFile);

    return _possibleConstructorReturn(this, (ExportFile.__proto__ || Object.getPrototypeOf(ExportFile)).apply(this, arguments));
  }

  _createClass(ExportFile, [{
    key: 'isEnabled',

    /**
     * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
     * hook and if it returns `true` than the {@link ExportFile#enablePlugin} method is called.
     *
     * @returns {Boolean}
     */
    value: function isEnabled() {
      return true;
    }

    /**
     * @typedef ExportOptions
     * @memberof ExportFile
     * @type {object}
     * @property {boolean} [exportHiddenRows=false] Include hidden rows in the exported file.
     * @property {boolean} [exportHiddenColumns=false] Include hidden columns in the exported file.
     * @property {boolean} [columnHeaders=false] Include column headers in the exported file.
     * @property {boolean} [rowHeaders=false] Include row headers in the exported file.
     * @property {string} [columnDelimiter=','] Column delimiter.
     * @property {string} [range=[]] Cell range that will be exported to file.
     */

    /**
     * Exports table data as a string.
     *
     * @param {String} format Export format type eq. `'csv'`.
     * @param {ExportOptions} options Export options.
    */

  }, {
    key: 'exportAsString',
    value: function exportAsString(format) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._createTypeFormatter(format, options).export();
    }

    /**
     * Exports table data as a blob object.
     *
     * @param {String} format Export format type eq. `'csv'`.
     * @param {ExportOptions} options Export options.
    */

  }, {
    key: 'exportAsBlob',
    value: function exportAsBlob(format) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._createBlob(this._createTypeFormatter(format, options));
    }

    /**
     * Exports table data as a downloadable file.
     *
     * @param {String} format Export format type eq. `'csv'`.
     * @param {ExportOptions} options Export options.
     */

  }, {
    key: 'downloadFile',
    value: function downloadFile(format) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var formatter = this._createTypeFormatter(format, options);
      var blob = this._createBlob(formatter);
      var URL = window.URL || window.webkitURL;

      var a = document.createElement('a');
      var name = formatter.options.filename + '.' + formatter.options.fileExtension;

      if (a.download !== void 0) {
        var url = URL.createObjectURL(blob);

        a.style.display = 'none';
        a.setAttribute('href', url);
        a.setAttribute('download', name);
        document.body.appendChild(a);
        a.dispatchEvent(new MouseEvent('click'));
        document.body.removeChild(a);

        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 100);
      } else if (navigator.msSaveOrOpenBlob) {
        // IE10+
        navigator.msSaveOrOpenBlob(blob, name);
      }
    }

    /**
     * Creates and returns class formatter for specified export type.
     *
     * @private
     * @param {String} format Export format type eq. `'csv'`.
     * @param {ExportOptions} options Export options.
     */

  }, {
    key: '_createTypeFormatter',
    value: function _createTypeFormatter(format) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!EXPORT_TYPES[format]) {
        throw new Error('Export format type "' + format + '" is not supported.');
      }

      return typeFactory(format, new DataProvider(this.hot), options);
    }

    /**
     * Creates blob object based on provided type formatter class.
     *
     * @private
     * @param {BaseType} typeFormatter
     * @returns {Blob}
     */

  }, {
    key: '_createBlob',
    value: function _createBlob(typeFormatter) {
      var formatter = null;

      if (typeof Blob !== 'undefined') {
        formatter = new Blob(['\uFEFF' + typeFormatter.export()], {
          type: typeFormatter.options.mimeType + ';charset=utf-8'
        });
      }

      return formatter;
    }
  }]);

  return ExportFile;
}(BasePlugin);

registerPlugin('exportFile', ExportFile);

export default ExportFile;