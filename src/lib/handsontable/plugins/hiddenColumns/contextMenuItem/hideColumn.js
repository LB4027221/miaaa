var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { rangeEach } from 'handsontable/es/helpers/number';
import * as C from 'handsontable/es/i18n/constants';

export default function hideColumnItem(hiddenColumnsPlugin) {
  return {
    key: 'hidden_columns_hide',
    name: function name() {
      var selection = this.getSelectedLast();
      var pluralForm = 0;

      if (Array.isArray(selection)) {
        var _selection = _slicedToArray(selection, 4),
            fromColumn = _selection[1],
            toColumn = _selection[3];

        if (fromColumn - toColumn !== 0) {
          pluralForm = 1;
        }
      }

      return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_HIDE_COLUMN, pluralForm);
    },
    callback: function callback() {
      var _getSelectedRangeLast = this.getSelectedRangeLast(),
          from = _getSelectedRangeLast.from,
          to = _getSelectedRangeLast.to;

      var start = Math.min(from.col, to.col);
      var end = Math.max(from.col, to.col);

      rangeEach(start, end, function (column) {
        return hiddenColumnsPlugin.hideColumn(column);
      });

      this.render();
      this.view.wt.wtOverlays.adjustElementsSize(true);
    },

    disabled: false,
    hidden: function hidden() {
      return !this.selection.isSelectedByColumnHeader();
    }
  };
}