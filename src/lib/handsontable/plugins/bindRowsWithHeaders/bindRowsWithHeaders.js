var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base';
import { rangeEach } from 'handsontable/es/helpers/number';
import { registerPlugin } from 'handsontable/es/plugins';
import BindStrategy from './bindStrategy';

/**
 * @plugin BindRowsWithHeaders
 * @pro
 *
 * @description
 * Plugin allows binding the table rows with their headers.
 *
 * If the plugin is enabled, the table row headers will "stick" to the rows, when they are hidden/moved. Basically, if
 * at the initialization row 0 has a header titled "A", it will have it no matter what you do with the table.
 *
 * @example
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   date: getData(),
 *   // enable plugin
 *   bindRowsWithHeaders: true
 * });
 * ```
 */

var BindRowsWithHeaders = function (_BasePlugin) {
  _inherits(BindRowsWithHeaders, _BasePlugin);

  function BindRowsWithHeaders(hotInstance) {
    _classCallCheck(this, BindRowsWithHeaders);

    /**
     * Strategy object for binding rows with headers.
     *
     * @private
     * @type {BindStrategy}
     */
    var _this = _possibleConstructorReturn(this, (BindRowsWithHeaders.__proto__ || Object.getPrototypeOf(BindRowsWithHeaders)).call(this, hotInstance));

    _this.bindStrategy = new BindStrategy();
    /**
     * List of last removed row indexes.
     *
     * @private
     * @type {Array}
     */
    _this.removedRows = [];
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link BindRowsWithHeaders#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(BindRowsWithHeaders, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().bindRowsWithHeaders;
    }

    /**
     * Enables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'enablePlugin',
    value: function enablePlugin() {
      var _this2 = this;

      if (this.enabled) {
        return;
      }
      var bindStrategy = this.hot.getSettings().bindRowsWithHeaders;

      if (typeof bindStrategy !== 'string') {
        bindStrategy = BindStrategy.DEFAULT_STRATEGY;
      }
      this.bindStrategy.setStrategy(bindStrategy);
      this.bindStrategy.createMap(this.hot.countSourceRows());

      this.addHook('modifyRowHeader', function (row) {
        return _this2.onModifyRowHeader(row);
      });
      this.addHook('afterCreateRow', function (index, amount) {
        return _this2.onAfterCreateRow(index, amount);
      });
      this.addHook('beforeRemoveRow', function (index, amount) {
        return _this2.onBeforeRemoveRow(index, amount);
      });
      this.addHook('afterRemoveRow', function () {
        return _this2.onAfterRemoveRow();
      });
      this.addHook('afterLoadData', function (firstRun) {
        return _this2.onAfterLoadData(firstRun);
      });

      _get(BindRowsWithHeaders.prototype.__proto__ || Object.getPrototypeOf(BindRowsWithHeaders.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: 'updatePlugin',
    value: function updatePlugin() {
      _get(BindRowsWithHeaders.prototype.__proto__ || Object.getPrototypeOf(BindRowsWithHeaders.prototype), 'updatePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.removedRows.length = 0;
      this.bindStrategy.clearMap();
      _get(BindRowsWithHeaders.prototype.__proto__ || Object.getPrototypeOf(BindRowsWithHeaders.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * On modify row header listener.
     *
     * @private
     * @param {Number} row Row index.
     * @returns {Number}
     *
     * @fires Hooks#modifyRow
     */

  }, {
    key: 'onModifyRowHeader',
    value: function onModifyRowHeader(row) {
      return this.bindStrategy.translate(this.hot.runHooks('modifyRow', row));
    }

    /**
     * On after create row listener.
     *
     * @private
     * @param {Number} index Row index.
     * @param {Number} amount Defines how many rows removed.
     */

  }, {
    key: 'onAfterCreateRow',
    value: function onAfterCreateRow(index, amount) {
      this.bindStrategy.createRow(index, amount);
    }

    /**
     * On before remove row listener.
     *
     * @private
     * @param {Number} index Row index.
     * @param {Number} amount Defines how many rows removed.
     *
     * @fires Hooks#modifyRow
     */

  }, {
    key: 'onBeforeRemoveRow',
    value: function onBeforeRemoveRow(index, amount) {
      var _this3 = this;

      this.removedRows.length = 0;

      if (index !== false) {
        // Collect physical row index.
        rangeEach(index, index + amount - 1, function (removedIndex) {
          _this3.removedRows.push(_this3.hot.runHooks('modifyRow', removedIndex));
        });
      }
    }

    /**
     * On after remove row listener.
     *
     * @private
     */

  }, {
    key: 'onAfterRemoveRow',
    value: function onAfterRemoveRow() {
      this.bindStrategy.removeRow(this.removedRows);
    }

    /**
     * On after load data listener.
     *
     * @private
     * @param {Boolean} firstRun Indicates if hook was fired while Handsontable initialization.
     */

  }, {
    key: 'onAfterLoadData',
    value: function onAfterLoadData(firstRun) {
      if (!firstRun) {
        this.bindStrategy.createMap(this.hot.countSourceRows());
      }
    }

    /**
     * Destroys the plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.bindStrategy.destroy();
      _get(BindRowsWithHeaders.prototype.__proto__ || Object.getPrototypeOf(BindRowsWithHeaders.prototype), 'destroy', this).call(this);
    }
  }]);

  return BindRowsWithHeaders;
}(BasePlugin);

registerPlugin('bindRowsWithHeaders', BindRowsWithHeaders);

export default BindRowsWithHeaders;