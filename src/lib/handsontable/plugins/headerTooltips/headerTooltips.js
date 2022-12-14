var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { outerWidth } from 'handsontable/es/helpers/dom/element.js';
import { registerPlugin } from 'handsontable/es/plugins.js';
import { rangeEach } from 'handsontable/es/helpers/number';
import BasePlugin from 'handsontable/es/plugins/_base.js';

/**
 * @plugin HeaderTooltips
 * @pro
 *
 * @description
 * Allows to add a tooltip to the table headers.
 *
 * Available options:
 * * the `rows` property defines if tooltips should be added to row headers,
 * * the `columns` property defines if tooltips should be added to column headers,
 * * the `onlyTrimmed` property defines if tooltips should be added only to headers, which content is trimmed by the header itself (the content being wider then the header).
 *
 * @example
 * ```js
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   date: getData(),
 *   // enable and configure header tooltips
 *   headerTooltips: {
 *     rows: true,
 *     columns: true,
 *     onlyTrimmed: false
 *   }
 * });
 * ```
 */

var HeaderTooltips = function (_BasePlugin) {
  _inherits(HeaderTooltips, _BasePlugin);

  function HeaderTooltips(hotInstance) {
    _classCallCheck(this, HeaderTooltips);

    /**
     * Cached plugin settings.
     *
     * @private
     * @type {Boolean|Object}
     */
    var _this = _possibleConstructorReturn(this, (HeaderTooltips.__proto__ || Object.getPrototypeOf(HeaderTooltips)).call(this, hotInstance));

    _this.settings = null;
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link HeaderTooltips#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(HeaderTooltips, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().headerTooltips;
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

      this.settings = this.hot.getSettings().headerTooltips;

      this.parseSettings();

      this.addHook('afterGetColHeader', function (col, TH) {
        return _this2.onAfterGetHeader(col, TH);
      });
      this.addHook('afterGetRowHeader', function (col, TH) {
        return _this2.onAfterGetHeader(col, TH);
      });

      _get(HeaderTooltips.prototype.__proto__ || Object.getPrototypeOf(HeaderTooltips.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.settings = null;

      this.clearTitleAttributes();

      _get(HeaderTooltips.prototype.__proto__ || Object.getPrototypeOf(HeaderTooltips.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Parses the plugin settings.
     *
     * @private
     */

  }, {
    key: 'parseSettings',
    value: function parseSettings() {
      if (typeof this.settings === 'boolean') {
        this.settings = {
          rows: true,
          columns: true,
          onlyTrimmed: false
        };
      }
    }

    /**
     * Clears the previously assigned title attributes.
     *
     * @private
     */

  }, {
    key: 'clearTitleAttributes',
    value: function clearTitleAttributes() {
      var headerLevels = this.hot.view.wt.getSetting('columnHeaders').length;
      var mainHeaders = this.hot.view.wt.wtTable.THEAD;
      var topHeaders = this.hot.view.wt.wtOverlays.topOverlay.clone.wtTable.THEAD;
      var topLeftCornerOverlay = this.hot.view.wt.wtOverlays.topLeftCornerOverlay;
      var topLeftCornerHeaders = topLeftCornerOverlay ? topLeftCornerOverlay.clone.wtTable.THEAD : null;

      rangeEach(0, headerLevels - 1, function (i) {
        var masterLevel = mainHeaders.childNodes[i];
        var topLevel = topHeaders.childNodes[i];
        var topLeftCornerLevel = topLeftCornerHeaders ? topLeftCornerHeaders.childNodes[i] : null;

        rangeEach(0, masterLevel.childNodes.length - 1, function (j) {
          masterLevel.childNodes[j].removeAttribute('title');

          if (topLevel && topLevel.childNodes[j]) {
            topLevel.childNodes[j].removeAttribute('title');
          }

          if (topLeftCornerHeaders && topLeftCornerLevel && topLeftCornerLevel.childNodes[j]) {
            topLeftCornerLevel.childNodes[j].removeAttribute('title');
          }
        });
      }, true);
    }

    /**
     * Adds a tooltip to the headers.
     *
     * @private
     * @param {Number} index
     * @param {HTMLElement} TH
     */

  }, {
    key: 'onAfterGetHeader',
    value: function onAfterGetHeader(index, TH) {
      var innerSpan = TH.querySelector('span');
      var isColHeader = TH.parentNode.parentNode.nodeName === 'THEAD';

      if (isColHeader && this.settings.columns || !isColHeader && this.settings.rows) {
        if (this.settings.onlyTrimmed) {
          if (outerWidth(innerSpan) >= outerWidth(TH) && outerWidth(innerSpan) !== 0) {
            TH.setAttribute('title', innerSpan.textContent);
          }
        } else {
          TH.setAttribute('title', innerSpan.textContent);
        }
      }
    }

    /**
     * Destroys the plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.settings = null;

      _get(HeaderTooltips.prototype.__proto__ || Object.getPrototypeOf(HeaderTooltips.prototype), 'destroy', this).call(this);
    }
  }]);

  return HeaderTooltips;
}(BasePlugin);

registerPlugin('headerTooltips', HeaderTooltips);

export default HeaderTooltips;