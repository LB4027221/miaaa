var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { mixin } from 'handsontable/es/helpers/object';
import localHooks from 'handsontable/es/mixins/localHooks';

import * as columnSorting from './alterOperation/columnSorting';
import * as insertColumn from './alterOperation/insertColumn';
import * as insertRow from './alterOperation/insertRow';
import * as removeColumn from './alterOperation/removeColumn';
import * as removeRow from './alterOperation/removeRow';

var operations = new Map();

registerOperation(columnSorting.OPERATION_NAME, columnSorting);
registerOperation(insertColumn.OPERATION_NAME, insertColumn);
registerOperation(insertRow.OPERATION_NAME, insertRow);
registerOperation(removeColumn.OPERATION_NAME, removeColumn);
registerOperation(removeRow.OPERATION_NAME, removeRow);

/**
 * Alter Manager is a service that is responsible for changing the formula expressions (especially cell coordinates)
 * based on specific alter operation applied into the table.
 *
 * For example, when a user adds a new row the algorithm that moves all the cells below the added row down by one row
 * should be triggered (eq: cell A5 become A6 etc).
 *
 * All alter operations are defined in the "alterOperation/" directory.
 *
 * @class AlterManager
 * @util
 */

var AlterManager = function () {
  function AlterManager(sheet) {
    _classCallCheck(this, AlterManager);

    /**
     * Instance of {@link Sheet}.
     *
     * @type {Sheet}
     */
    this.sheet = sheet;
    /**
     * Handsontable instance.
     *
     * @type {Core}
     */
    this.hot = sheet.hot;
    /**
     * Instance of {@link DataProvider}.
     *
     * @type {DataProvider}
     */
    this.dataProvider = sheet.dataProvider;
    /**
     * Instance of {@link Matrix}.
     *
     * @type {Matrix}
     */
    this.matrix = sheet.matrix;
  }

  /**
   * Prepare to execute an alter algorithm. This preparation can be useful for collecting some variables and
   * states before specific algorithm will be executed.
   *
   * @param  {String} action One of the action defined in alterOperation.
   * @param  {*} args Arguments pass to alter operation.
   */


  _createClass(AlterManager, [{
    key: 'prepareAlter',
    value: function prepareAlter(action) {
      if (!operations.has(action)) {
        throw Error('Alter operation "' + action + '" not exist.');
      }

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      operations.get(action).prepare.apply(this, args);
    }

    /**
     * Trigger an alter algorithm and after executing code trigger local hook ("afterAlter").
     *
     * @param {String} action One of the action defined in alterOperation.
     * @param {*} args Arguments pass to alter operation.
     */

  }, {
    key: 'triggerAlter',
    value: function triggerAlter(action) {
      if (!operations.has(action)) {
        throw Error('Alter operation "' + action + '" not exist.');
      }

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      operations.get(action).operate.apply(this, args);
      this.runLocalHooks.apply(this, ['afterAlter'].concat(args));
    }

    /**
     * Destroy class.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.sheet = null;
      this.hot = null;
      this.dataProvider = null;
      this.matrix = null;
    }
  }]);

  return AlterManager;
}();

mixin(AlterManager, localHooks);

export default AlterManager;

var empty = function empty() {};

export function registerOperation(name, descriptor) {
  if (!operations.has(name)) {
    operations.set(name, {
      prepare: descriptor.prepare || empty,
      operate: descriptor.operate || empty
    });
  }
}