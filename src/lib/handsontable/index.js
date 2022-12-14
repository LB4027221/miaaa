import React from 'react'
import Handsontable from 'handsontable/es'
import Hooks from 'handsontable/es/pluginHooks'
// import 'handsontable-pro/dist/handsontable.full.css'
import './style.css'

import * as plugins from './plugins'
import zh from './plugins/zh'

Handsontable.hooks = Hooks.getSingleton()
Handsontable.plugins = {
  ...Handsontable.plugins,
  ...plugins
}

Handsontable.languages.registerLanguageDictionary(zh)

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var SettingsMapper = function () {
    function SettingsMapper() {
        classCallCheck(this, SettingsMapper);

        this.registeredHooks = Handsontable.hooks.getRegistered();
    }
    /**
     * Parse component settings into Handosntable-compatible settings.
     *
     * @param {Object} properties Object containing properties from the HotTable object.
     * @returns {Object} Handsontable-compatible settings object.
     */


    createClass(SettingsMapper, [{
        key: 'getSettings',
        value: function getSettings(properties) {
            var newSettings = {};
            if (properties.settings) {
                var settings = properties.settings;
                for (var key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        newSettings[key] = settings[key];
                    }
                }
            }
            for (var _key in properties) {
                if (_key !== 'settings' && properties.hasOwnProperty(_key)) {
                    newSettings[_key] = properties[_key];
                }
            }
            return newSettings;
        }
    }]);
    return SettingsMapper;
}();

var version="2.0.0";

/**
 * A Handsontable-ReactJS wrapper.
 *
 * To implement, use the `HotTable` tag with properties corresponding to Handsontable options.
 * For example:
 *
 * ```js
 * <HotTable id="hot" data={dataObject} contextMenu={true} colHeaders={true} width={600} height={300} stretchH="all" />
 *
 * // is analogous to
 * let hot = new Handsontable(document.getElementById('hot'), {
 *    data: dataObject,
 *    contextMenu: true,
 *    colHeaders: true,
 *    width: 600
 *    height: 300
 * });
 *
 * ```
 *
 * @class HotTable
 */
var HotTable = function (_React$Component) {
  inherits(HotTable, _React$Component);

  function HotTable() {
    classCallCheck(this, HotTable);

    /**
     * Reference to the `SettingsMapper` instance.
     *
     * @type {SettingsMapper}
     */
    var _this = possibleConstructorReturn(this, (HotTable.__proto__ || Object.getPrototypeOf(HotTable)).apply(this, arguments));

    _this.settingsMapper = new SettingsMapper();
    /**
     * The `id` of the main Handsontable DOM element.
     *
     * @type {String}
     */
    _this.id = null;
    /**
     * Reference to the Handsontable instance.
     *
     * @type {Object}
     */
    _this.hotInstance = null;
    /**
     * Reference to the main Handsontable DOM element.
     *
     * @type {HTMLElement}
     */
    _this.hotElementRef = null;
    return _this;
  }

  createClass(HotTable, [{
    key: 'setHotElementRef',

    /**
     * Set the reference to the main Handsontable DOM element.
     *
     * @param {HTMLElement} element The main Handsontable DOM element.
     */
    value: function setHotElementRef(element) {
      this.hotElementRef = element;
    }
    /**
     * Initialize Handsontable after the component has mounted.
     */

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var newSettings = this.settingsMapper.getSettings(this.props);
      this.Handsontable = Handsontable
      this.hotInstance = new Handsontable(this.hotElementRef, { ...newSettings, licenseKey: 'non-commercial-and-evaluation' });
    }
    /**
     * Call the `updateHot` method and prevent the component from re-rendering the instance.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      this.updateHot(this.settingsMapper.getSettings(nextProps));
      return false;
    }
    /**
     * Destroy the Handsontable instance when the parent component unmounts.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.hotInstance) {
        this.hotInstance.destroy();
      }
    }
    /**
     * Render the table.
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (JSON.stringify(this.props.data) !== JSON.stringify(props.data)) {
        this.hotInstance.loadData(props.data);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.id = this.props.id || 'hot-' + Math.random().toString(36).substring(5);
      this.className = this.props.className || '';
      this.style = this.props.style || {};
      return React.createElement("div", { ref: this.setHotElementRef.bind(this), id: this.id, className: this.className, style: this.style });
    }
    /**
     * Call the `updateSettings` method for the Handsontable instance.
     *
     * @param {Object} newSettings The settings object.
     */

  }, {
    key: 'updateHot',
    value: function updateHot(newSettings) {
      this.hotInstance.updateSettings(newSettings, false);
    }
  }], [{
    key: 'version',
    get: function get$$1() {
      return version;
    }
  }]);
  return HotTable;
}(React.Component);

export { HotTable };

export default Handsontable
