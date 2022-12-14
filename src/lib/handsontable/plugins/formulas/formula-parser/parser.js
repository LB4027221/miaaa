import Emitter from 'tiny-emitter';
import evaluateByOperator from './evaluate-by-operator/evaluate-by-operator';
import {Parser as GrammarParser} from './grammar-parser/grammar-parser';
import {trimEdges} from './helper/string';
import {toNumber, invertNumber} from './helper/number';
import {default as errorParser, isValidStrict as isErrorValid, ERROR, ERROR_NAME} from './error';
import {extractLabel, toLabel} from './helper/cell';

export {default as SUPPORTED_FORMULAS} from './supported-formulas';

/**
 * @class Parser
 */
class Parser extends Emitter {
  constructor() {
    super();
    this.parser = new GrammarParser();
    this.parser.yy = {
      toNumber,
      trimEdges,
      invertNumber,
      throwError: (errorName) => this._throwError(errorName),
      callVariable: (variable) => this._callVariable(variable),
      evaluateByOperator,
      callFunction: evaluateByOperator,
      cellValue: (value, sheet) => this._callCellValue(value, sheet),
      rangeValue: (start, end, sheet) => this._callRangeValue(start, end, sheet),
    };
    this.variables = Object.create(null);

    this
      .setVariable('TRUE', true)
      .setVariable('FALSE', false)
      .setVariable('NULL', null);
  }

  /**
   * Parse formula expression.
   *
   * @param {String} expression to parse.
   * @return {*} Returns an object with tow properties `error` and `result`.
   */
  parse(expression) {
    let result = null;
    let error = null;

    try {
      if (expression === '') {
        result = '';
      } else {
        result = this.parser.parse(expression);
      }
    } catch (ex) {
      const message = errorParser(ex.message);

      if (message) {
        error = message;
      } else {
        error = errorParser(ERROR);
      }
    }

    if (result instanceof Error) {
      error = errorParser(result.message) || errorParser(ERROR);
      result = null;
    }

    return {
      error: error,
      result: result
    };
  }

  /**
   * Set predefined variable name which can be visible while parsing formula expression.
   *
   * @param {String} name Variable name.
   * @param {*} value Variable value.
   * @returns {Parser}
   */
  setVariable(name, value) {
    this.variables[name] = value;

    return this;
  }

  /**
   * Get variable name.
   *
   * @param {String} name Variable name.
   * @returns {*}
   */
  getVariable(name) {
    return this.variables[name];
  }

  /**
   * Retrieve variable value by its name.
   *
   * @param name Variable name.
   * @returns {*}
   * @private
   */
  _callVariable(name) {
    let value = this.getVariable(name);

    this.emit('callVariable', name, (newValue) => {
      if (newValue !== void 0) {
        value = newValue;
      }
    });

    if (value === void 0) {
      throw Error(ERROR_NAME);
    }

    return value;
  }

  /**
   * Retrieve value by its label (`B3`, `B$3`, `B$3`, `$B$3`).
   *
   * @param {String} label Coordinates.
   * @param {String} sheet Reference sheet name
   * @returns {*}
   * @private
   */
  _callCellValue(label, sheet) {
    label = label.toUpperCase();
    const [row, column] = extractLabel(label);
    let value = void 0;

    let cellCoordinate = sheet ? {label, row, column, sheet} : {label, row, column};

    this.emit('callCellValue', cellCoordinate, (_value) => {
      value = _value;
    });

    return value;
  }

  /**
   * Retrieve value by its label (`B3:A1`, `B$3:A1`, `B$3:$A1`, `$B$3:A$1`).
   *
   * @param {String} startLabel Coordinates of the first cell.
   * @param {String} endLabel Coordinates of the last cell.
   * @param {String} sheet Reference sheet name
   * @returns {Array} Returns an array of mixed values.
   * @private
   */
  _callRangeValue(startLabel, endLabel, sheet) {
    startLabel = startLabel.toUpperCase();
    endLabel = endLabel.toUpperCase();

    const [startRow, startColumn] = extractLabel(startLabel);
    const [endRow, endColumn] = extractLabel(endLabel);
    let startCell = {};
    let endCell = {};

    if (startRow.index <= endRow.index) {
      startCell.row = startRow;
      endCell.row = endRow;
    } else {
      startCell.row = endRow;
      endCell.row = startRow;
    }

    if (startColumn.index <= endColumn.index) {
      startCell.column = startColumn;
      endCell.column = endColumn;
    } else {
      startCell.column = endColumn;
      endCell.column = startColumn;
    }

    startCell.label = toLabel(startCell.row, startCell.column);
    endCell.label = toLabel(endCell.row, endCell.column);

    if (sheet) {
      startCell.sheet = sheet;
      endCell.sheet = sheet;
    }

    let value = [];

    this.emit('callRangeValue', startCell, endCell, (_value = []) => {
      value = _value;
    });

    return value;
  }

  /**
   * Try to throw error by its name.
   *
   * @param {String} errorName Error name.
   * @returns {String}
   * @private
   */
  _throwError(errorName) {
    if (isErrorValid(errorName)) {
      throw Error(errorName);
    }

    throw Error(ERROR);
  }
}

const isFormulaError = errorParser
const ERROR_REF = 'REF'
export {
  Parser,
  isFormulaError,
  ERROR_REF,
  toLabel
}
