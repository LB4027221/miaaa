var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { arrayEach } from 'handsontable/es/helpers/array';
import { mixin } from 'handsontable/es/helpers/object';
import localHooks from 'handsontable/es/mixins/localHooks';
import stateSaver from 'handsontable/es/mixins/stateSaver';

/**
 * @plugin Filters
 * @class BaseComponent
 */

var BaseComponent = function () {
  function BaseComponent(hotInstance) {
    _classCallCheck(this, BaseComponent);

    this.hot = hotInstance;
    /**
     * List of registered component UI elements.
     *
     * @type {Array}
     */
    this.elements = [];
    /**
     * Flag which determines if element is hidden.
     *
     * @type {Boolean}
     */
    this.hidden = false;
  }

  /**
   * Reset elements to their initial state.
   */


  _createClass(BaseComponent, [{
    key: 'reset',
    value: function reset() {
      arrayEach(this.elements, function (ui) {
        return ui.reset();
      });
    }

    /**
     * Hide component.
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.hidden = true;
    }

    /**
     * Show component.
     */

  }, {
    key: 'show',
    value: function show() {
      this.hidden = false;
    }

    /**
     * Check if component is hidden.
     *
     * @returns {Boolean}
     */

  }, {
    key: 'isHidden',
    value: function isHidden() {
      return this.hidden;
    }

    /**
     * Destroy element.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.clearLocalHooks();
      arrayEach(this.elements, function (ui) {
        return ui.destroy();
      });
      this.elements = null;
      this.hot = null;
    }
  }]);

  return BaseComponent;
}();

mixin(BaseComponent, localHooks);
mixin(BaseComponent, stateSaver);

export default BaseComponent;