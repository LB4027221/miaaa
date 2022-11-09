var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from 'handsontable/es/plugins/_base';
import { arrayEach } from 'handsontable/es/helpers/array';
import CommandExecutor from 'handsontable/es/plugins/contextMenu/commandExecutor';
import EventManager from 'handsontable/es/eventManager';
import { hasClass } from 'handsontable/es/helpers/dom/element';
import ItemsFactory from 'handsontable/es/plugins/contextMenu/itemsFactory';
import Menu from 'handsontable/es/plugins/contextMenu/menu';
import { registerPlugin } from 'handsontable/es/plugins';
import Hooks from 'handsontable/es/pluginHooks';
import { stopPropagation } from 'handsontable/es/helpers/dom/event';
import { COLUMN_LEFT, COLUMN_RIGHT, REMOVE_COLUMN, CLEAR_COLUMN, READ_ONLY, ALIGNMENT, SEPARATOR } from 'handsontable/es/plugins/contextMenu/predefinedItems';

Hooks.getSingleton().register('afterDropdownMenuDefaultOptions');
Hooks.getSingleton().register('beforeDropdownMenuShow');
Hooks.getSingleton().register('afterDropdownMenuShow');
Hooks.getSingleton().register('afterDropdownMenuHide');
Hooks.getSingleton().register('afterDropdownMenuExecute');

var BUTTON_CLASS_NAME = 'changeType';

/**
 * @plugin DropdownMenu
 * @pro
 * @dependencies ContextMenu
 *
 * @description
 * This plugin creates the Handsontable Dropdown Menu. It allows to create a new row or column at any place in the grid
 * among [other features](http://docs.handsontable.com/demo-context-menu.html).
 * Possible values:
 * * `true` (to enable default options),
 * * `false` (to disable completely)
 *
 * or array of any available strings:
 * * `["row_above", "row_below", "col_left", "col_right",
 * "remove_row", "remove_col", "---------", "undo", "redo"]`.
 *
 * See [the dropdown menu demo](http://docs.handsontable.com/demo-dropdown-menu.html) for examples.
 *
 * @example
 * ```
 * const container = document.getElementById('example');
 * const hot = new Handsontable(container, {
 *   data: data,
 *   colHeaders: true,
 *   // enable dropdown menu
 *   dropdownMenu: true
 * });
 *
 * // or
 * const hot = new Handsontable(container, {
 *   data: data,
 *   colHeaders: true,
 *   // enable and configure dropdown menu
 *   dropdownMenu: ['remove_col', '---------', 'make_read_only', 'alignment']
 * });
 * ```
 */

var DropdownMenu = function (_BasePlugin) {
  _inherits(DropdownMenu, _BasePlugin);

  _createClass(DropdownMenu, null, [{
    key: 'DEFAULT_ITEMS',

    /**
     * Default menu items order when `dropdownMenu` is enabled by setting the config item to `true`.
     *
     * @returns {Array}
     */
    get: function get() {
      return [COLUMN_LEFT, COLUMN_RIGHT, SEPARATOR, REMOVE_COLUMN, SEPARATOR, CLEAR_COLUMN, SEPARATOR, READ_ONLY, SEPARATOR, ALIGNMENT];
    }
  }]);

  function DropdownMenu(hotInstance) {
    _classCallCheck(this, DropdownMenu);

    /**
     * Instance of {@link EventManager}.
     *
     * @private
     * @type {EventManager}
     */
    var _this = _possibleConstructorReturn(this, (DropdownMenu.__proto__ || Object.getPrototypeOf(DropdownMenu)).call(this, hotInstance));

    _this.eventManager = new EventManager(_this);
    /**
     * Instance of {@link CommandExecutor}.
     *
     * @private
     * @type {CommandExecutor}
     */
    _this.commandExecutor = new CommandExecutor(_this.hot);
    /**
     * Instance of {@link ItemsFactory}.
     *
     * @private
     * @type {ItemsFactory}
     */
    _this.itemsFactory = null;
    /**
     * Instance of {@link Menu}.
     *
     * @private
     * @type {Menu}
     */
    _this.menu = null;

    // One listener for enable/disable functionality
    _this.hot.addHook('afterGetColHeader', function (col, TH) {
      return _this.onAfterGetColHeader(col, TH);
    });
    return _this;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link DropdownMenu#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(DropdownMenu, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return this.hot.getSettings().dropdownMenu;
    }

    /**
     * Enables the plugin functionality for this Handsontable instance.
     *
     * @fires Hooks#afterDropdownMenuDefaultOptions
     * @fires Hooks#beforeDropdownMenuSetItems
     */

  }, {
    key: 'enablePlugin',
    value: function enablePlugin() {
      var _this2 = this;

      if (this.enabled) {
        return;
      }
      this.itemsFactory = new ItemsFactory(this.hot, DropdownMenu.DEFAULT_ITEMS);

      var settings = this.hot.getSettings().dropdownMenu;
      var predefinedItems = {
        items: this.itemsFactory.getItems(settings)
      };
      this.registerEvents();

      if (typeof settings.callback === 'function') {
        this.commandExecutor.setCommonCallback(settings.callback);
      }
      _get(DropdownMenu.prototype.__proto__ || Object.getPrototypeOf(DropdownMenu.prototype), 'enablePlugin', this).call(this);

      this.callOnPluginsReady(function () {
        _this2.hot.runHooks('afterDropdownMenuDefaultOptions', predefinedItems);

        _this2.itemsFactory.setPredefinedItems(predefinedItems.items);
        var menuItems = _this2.itemsFactory.getItems(settings);

        if (_this2.menu) {
          _this2.menu.destroy();
        }
        _this2.menu = new Menu(_this2.hot, {
          className: 'htDropdownMenu',
          keepInViewport: true
        });
        _this2.hot.runHooks('beforeDropdownMenuSetItems', menuItems);

        _this2.menu.setMenuItems(menuItems);

        _this2.menu.addLocalHook('beforeOpen', function () {
          return _this2.onMenuBeforeOpen();
        });
        _this2.menu.addLocalHook('afterOpen', function () {
          return _this2.onMenuAfterOpen();
        });
        _this2.menu.addLocalHook('afterClose', function () {
          return _this2.onMenuAfterClose();
        });
        _this2.menu.addLocalHook('executeCommand', function () {
          var _executeCommand;

          for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }

          return (_executeCommand = _this2.executeCommand).call.apply(_executeCommand, [_this2].concat(params));
        });

        // Register all commands. Predefined and added by user or by plugins
        arrayEach(menuItems, function (command) {
          return _this2.commandExecutor.registerCommand(command.key, command);
        });
      });
    }

    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: 'updatePlugin',
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();
      _get(DropdownMenu.prototype.__proto__ || Object.getPrototypeOf(DropdownMenu.prototype), 'updatePlugin', this).call(this);
    }

    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.close();

      if (this.menu) {
        this.menu.destroy();
      }
      _get(DropdownMenu.prototype.__proto__ || Object.getPrototypeOf(DropdownMenu.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Registers the DOM listeners.
     *
     * @private
     */

  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this3 = this;

      this.eventManager.addEventListener(this.hot.rootElement, 'click', function (event) {
        return _this3.onTableClick(event);
      });
    }

    /**
     * Opens menu and re-position it based on the passed coordinates.
     *
     * @param {Object|Event} position An object with `pageX` and `pageY` properties which contains values relative to
     *                                the top left of the fully rendered content area in the browser or with `clientX`
     *                                and `clientY`  properties which contains values relative to the upper left edge
     *                                of the content area (the viewport) of the browser window. This object is structurally
     *                                compatible with native mouse event so it can be used either.
     * @fires Hooks#beforeDropdownMenuShow
     * @fires Hooks#afterDropdownMenuShow
     */

  }, {
    key: 'open',
    value: function open(position) {
      if (!this.menu) {
        return;
      }
      this.menu.open();

      if (position.width) {
        this.menu.setOffset('left', position.width);
      }
      this.menu.setPosition(position);

      // ContextMenu is not detected HotTableEnv correctly because is injected outside hot-table
      this.menu.hotMenu.isHotTableEnv = this.hot.isHotTableEnv;
      // Handsontable.eventManager.isHotTableEnv = this.hot.isHotTableEnv;
    }

    /**
     * Closes dropdown menu.
     */

  }, {
    key: 'close',
    value: function close() {
      if (!this.menu) {
        return;
      }
      this.menu.close();
    }

    /**
     * Executes context menu command.
     *
     * You can execute all predefined commands:
     *  * `'row_above'` - Insert row above
     *  * `'row_below'` - Insert row below
     *  * `'col_left'` - Insert column left
     *  * `'col_right'` - Insert column right
     *  * `'clear_column'` - Clear selected column
     *  * `'remove_row'` - Remove row
     *  * `'remove_col'` - Remove column
     *  * `'undo'` - Undo last action
     *  * `'redo'` - Redo last action
     *  * `'make_read_only'` - Make cell read only
     *  * `'alignment:left'` - Alignment to the left
     *  * `'alignment:top'` - Alignment to the top
     *  * `'alignment:right'` - Alignment to the right
     *  * `'alignment:bottom'` - Alignment to the bottom
     *  * `'alignment:middle'` - Alignment to the middle
     *  * `'alignment:center'` - Alignment to the center (justify)
     *
     * Or you can execute command registered in settings where `key` is your command name.
     *
     * @param {String} commandName Command name to execute.
     * @param {*} params
     */

  }, {
    key: 'executeCommand',
    value: function executeCommand(commandName) {
      var _commandExecutor;

      for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      (_commandExecutor = this.commandExecutor).execute.apply(_commandExecutor, [commandName].concat(params));
    }

    /**
     * Turns on / off listening on dropdown menu
     *
     * @private
     * @param {Boolean} listen Turn on listening when value is set to true, otherwise turn it off.
     */

  }, {
    key: 'setListening',
    value: function setListening() {
      var listen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.menu.isOpened()) {
        if (listen) {
          this.menu.hotMenu.listen();
        } else {
          this.menu.hotMenu.unlisten();
        }
      }
    }

    /**
     * Table click listener.
     *
     * @private
     * @param {Event} event
     */

  }, {
    key: 'onTableClick',
    value: function onTableClick(event) {
      stopPropagation(event);

      if (hasClass(event.target, BUTTON_CLASS_NAME) && !this.menu.isOpened()) {
        var rect = event.target.getBoundingClientRect();

        this.open({
          left: rect.left,
          top: rect.top + event.target.offsetHeight + 3,
          width: rect.width,
          height: rect.height
        });
      }
    }

    /**
     * On after get column header listener.
     *
     * @private
     * @param {Number} col
     * @param {HTMLTableCellElement} TH
     */

  }, {
    key: 'onAfterGetColHeader',
    value: function onAfterGetColHeader(col, TH) {
      // Corner or a higher-level header
      var headerRow = TH.parentNode;
      if (!headerRow) {
        return;
      }

      var headerRowList = headerRow.parentNode.childNodes;
      var level = Array.prototype.indexOf.call(headerRowList, headerRow);

      if (col < 0 || level !== headerRowList.length - 1) {
        return;
      }

      var existingButton = TH.querySelector('.' + BUTTON_CLASS_NAME);

      // Plugin enabled and buttons already exists, return.
      if (this.enabled && existingButton) {
        return;
      }
      // Plugin disabled and buttons still exists, so remove them.
      if (!this.enabled) {
        if (existingButton) {
          existingButton.parentNode.removeChild(existingButton);
        }

        return;
      }
      var button = document.createElement('button');

      button.className = BUTTON_CLASS_NAME;

      // prevent page reload on button click
      button.onclick = function () {
        return false;
      };

      TH.firstChild.insertBefore(button, TH.firstChild.firstChild);
    }

    /**
     * On menu before open listener.
     *
     * @private
     * @fires Hooks#beforeDropdownMenuShow
     */

  }, {
    key: 'onMenuBeforeOpen',
    value: function onMenuBeforeOpen() {
      this.hot.runHooks('beforeDropdownMenuShow', this);
    }

    /**
     * On menu after open listener.
     *
     * @private
     * @fires Hooks#afterDropdownMenuShow
     */

  }, {
    key: 'onMenuAfterOpen',
    value: function onMenuAfterOpen() {
      this.hot.runHooks('afterDropdownMenuShow', this);
    }

    /**
     * On menu after close listener.
     *
     * @private
     * @fires Hooks#afterDropdownMenuHide
     */

  }, {
    key: 'onMenuAfterClose',
    value: function onMenuAfterClose() {
      this.hot.listen();
      this.hot.runHooks('afterDropdownMenuHide', this);
    }

    /**
     * Destroys the plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.close();

      if (this.menu) {
        this.menu.destroy();
      }
      _get(DropdownMenu.prototype.__proto__ || Object.getPrototypeOf(DropdownMenu.prototype), 'destroy', this).call(this);
    }
  }]);

  return DropdownMenu;
}(BasePlugin);

DropdownMenu.SEPARATOR = {
  name: SEPARATOR
};

registerPlugin('dropdownMenu', DropdownMenu);

export default DropdownMenu;