/* eslint-disable import/prefer-default-export */

var COLUMN_ORDER_PREFIX = 'sort';

/**
 * Get CSS classes which should be added to particular column header.
 *
 * @param {Object} columnStatesManager Instance of column state manager.
 * @param {Number} column Physical column index.
 * @param {Boolean} showSortIndicator Indicates if indicator should be shown for the particular column.
 * @returns {Array} Array of CSS classes.
 */
export function getClassesToAdd(columnStatesManager, column, showSortIndicator) {
  var cssClasses = [];

  if (showSortIndicator === false) {
    return cssClasses;
  }

  if (columnStatesManager.isColumnSorted(column) && columnStatesManager.getNumberOfSortedColumns() > 1) {
    cssClasses.push(COLUMN_ORDER_PREFIX + '-' + (columnStatesManager.getIndexOfColumnInSortQueue(column) + 1));
  }

  return cssClasses;
}

/**
 * Get CSS classes which should be removed from column header.
 *
 * @param {HTMLElement} htmlElement
 * @returns {Array} Array of CSS classes.
 */
export function getClassedToRemove(htmlElement) {
  var cssClasses = htmlElement.className.split(' ');
  var sortSequenceRegExp = new RegExp('^' + COLUMN_ORDER_PREFIX + '-[0-9]{1,2}$');

  return cssClasses.filter(function (cssClass) {
    return sortSequenceRegExp.test(cssClass);
  });
}