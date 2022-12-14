function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Csv from './types/csv.js';

export var TYPE_CSV = 'csv';
export var TYPE_EXCEL = 'excel';
export var TYPE_PDF = 'pdf';

export var EXPORT_TYPES = _defineProperty({}, TYPE_CSV, Csv);

export default function typeFactory(type, dataProvider, options) {
  if (typeof EXPORT_TYPES[type] === 'function') {
    return new EXPORT_TYPES[type](dataProvider, options);
  }

  return null;
}