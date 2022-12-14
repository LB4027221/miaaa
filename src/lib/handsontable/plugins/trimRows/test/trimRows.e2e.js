var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

describe('TrimRows', function () {
  var id = 'testContainer';

  function getMultilineData(rows, cols) {
    var data = Handsontable.helper.createSpreadsheetData(rows, cols);

    // Column C
    data[0][2] += '\nline';
    data[1][2] += '\nline\nline';

    return data;
  }

  beforeEach(function () {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should trim rows defined in `trimRows` property', function () {
    handsontable({
      data: Handsontable.helper.createSpreadsheetData(10, 10),
      trimRows: [2, 6, 7],
      cells: function cells(row) {
        var meta = {};

        if (row === 2) {
          meta.type = 'date';
        }

        return meta;
      },

      width: 500,
      height: 300
    });

    expect(getDataAtCell(0, 0)).toBe('A1');
    expect(getDataAtCell(1, 0)).toBe('A2');
    expect(getDataAtCell(2, 0)).toBe('A4');
    expect(getDataAtCell(3, 0)).toBe('A5');
    expect(getDataAtCell(4, 0)).toBe('A6');
    expect(getDataAtCell(5, 0)).toBe('A9');
    expect(getDataAtCell(6, 0)).toBe('A10');
    expect(getCellMeta(0, 0).type).toBe('text');
    expect(getCellMeta(1, 0).type).toBe('text');
    expect(getCellMeta(2, 0).type).toBe('text');
    expect(getCellMeta(3, 0).type).toBe('text');
    expect(getCellMeta(4, 0).type).toBe('text');
    expect(getCellMeta(5, 0).type).toBe('text');
    expect(getCellMeta(6, 0).type).toBe('text');
  });

  it('should trim rows after re-load data calling loadData method', function () {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(10, 10),
      trimRows: [0, 2],
      width: 500,
      height: 300
    });

    hot.loadData(Handsontable.helper.createSpreadsheetData(5, 5));

    expect(getDataAtCell(0, 0)).toBe('A2');
    expect(getDataAtCell(1, 0)).toBe('A4');
    expect(getDataAtCell(2, 0)).toBe('A5');
    expect(getDataAtCell(3, 0)).toBe(null);
    expect(getDataAtCell(4, 0)).toBe(null);
  });

  it('should return to default state after call disablePlugin method', function () {
    var hot = handsontable({
      data: getMultilineData(10, 10),
      trimRows: [2, 6, 7],
      width: 500,
      height: 300
    });
    hot.getPlugin('trimRows').disablePlugin();
    hot.render();

    expect(getDataAtCell(0, 0)).toBe('A1');
    expect(getDataAtCell(1, 0)).toBe('A2');
    expect(getDataAtCell(2, 0)).toBe('A3');
    expect(getDataAtCell(3, 0)).toBe('A4');
    expect(getDataAtCell(4, 0)).toBe('A5');
    expect(getDataAtCell(5, 0)).toBe('A6');
    expect(getDataAtCell(6, 0)).toBe('A7');
  });

  it('should trim rows after call enablePlugin method', function () {
    var hot = handsontable({
      data: getMultilineData(10, 10),
      trimRows: [2, 6, 7],
      width: 500,
      height: 300
    });
    hot.getPlugin('hiddenRows').disablePlugin();
    hot.getPlugin('hiddenRows').enablePlugin();
    hot.render();

    expect(getDataAtCell(0, 0)).toBe('A1');
    expect(getDataAtCell(1, 0)).toBe('A2');
    expect(getDataAtCell(2, 0)).toBe('A4');
    expect(getDataAtCell(3, 0)).toBe('A5');
    expect(getDataAtCell(4, 0)).toBe('A6');
    expect(getDataAtCell(5, 0)).toBe('A9');
    expect(getDataAtCell(6, 0)).toBe('A10');
  });

  it('should trim row after call trimRow method', function () {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      trimRows: true,
      width: 500,
      height: 300
    });

    expect(getDataAtCell(1, 0)).toBe('A2');

    hot.getPlugin('trimRows').trimRow(1);
    hot.render();

    expect(getDataAtCell(1, 0)).toBe('A3');
  });

  it('should untrim row after call untrimRow method', function () {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      trimRows: [1],
      width: 500,
      height: 300
    });

    expect(getDataAtCell(1, 0)).toBe('A3');

    hot.getPlugin('trimRows').untrimRow(1);
    hot.render();

    expect(getDataAtCell(1, 0)).toBe('A2');
  });

  it('should call hook after trim row', function () {
    var callback = jasmine.createSpy();
    var hot = handsontable({
      data: getMultilineData(5, 10),
      trimRows: true,
      width: 500,
      height: 300
    });

    expect(callback).not.toHaveBeenCalled();

    hot.addHook('afterTrimRow', callback);
    hot.getPlugin('trimRows').trimRow(1);
    hot.render();

    expect(callback).toHaveBeenCalledWith([1], void 0, void 0, void 0, void 0, void 0);
  });

  it('should call hook after untrim row', function () {
    var callback = jasmine.createSpy();
    var hot = handsontable({
      data: getMultilineData(5, 10),
      trimRows: [1],
      width: 500,
      height: 300
    });

    expect(callback).not.toHaveBeenCalled();

    hot.addHook('afterUntrimRow', callback);
    hot.getPlugin('trimRows').untrimRow(1);
    hot.render();

    expect(callback).toHaveBeenCalledWith([1], void 0, void 0, void 0, void 0, void 0);
  });

  it('should trim big data set', function () {
    handsontable({
      data: Handsontable.helper.createSpreadsheetData(1000, 5),
      // leave first row and last 3 rows
      trimRows: Array.apply(undefined, _toConsumableArray(Array(996))).map(function (v, i) {
        return i + 1;
      }),
      width: 500,
      height: 300
    });

    expect(getDataAtCell(0, 0)).toBe('A1');
    expect(getDataAtCell(1, 0)).toBe('A998');
    expect(getDataAtCell(2, 0)).toBe('A999');
    expect(getDataAtCell(3, 0)).toBe('A1000');
    expect(getDataAtCell(4, 0)).toBe(null);
  });

  it('should remove correct rows', function () {
    handsontable({
      data: getMultilineData(5, 10),
      trimRows: [1],
      width: 500,
      height: 300
    });

    alter('remove_row', 0, 2);

    expect(getDataAtCell(0, 0)).toBe('A4');
    expect(getDataAtCell(1, 0)).toBe('A5');
    expect(getDataAtCell(2, 0)).toBe(null);
  });

  it('should remove correct rows after inserting new ones', function () {
    handsontable({
      data: getMultilineData(6, 10),
      trimRows: [1, 4],
      width: 500,
      height: 300
    });

    alter('insert_row', 1);
    alter('insert_row', 3);
    alter('remove_row', 0, 3);

    expect(getDataAtCell(0, 0)).toBe(null);
    expect(getDataAtCell(1, 0)).toBe('A4');
    expect(getDataAtCell(2, 0)).toBe('A6');
    expect(getDataAtCell(3, 0)).toBe(null);
  });

  it('should clear cache after loading new data by `loadData` function, when plugin `trimRows` is enabled #92', function (done) {
    var _this = this;

    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(5, 5),
      trimRows: true
    });

    hot.loadData(Handsontable.helper.createSpreadsheetData(10, 10));

    setTimeout(function () {
      expect(_this.$container.find('td').length).toEqual(100);
      done();
    }, 100);
  });

  it('should not affect `afterValidate` hook #11', function (done) {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(5, 2),
      trimRows: true,
      cells: function cells() {
        return { type: 'numeric' };
      }
    });

    hot.populateFromArray(5, 1, [['A1', 'A2'], ['B1', 'B2'], ['C1', 'C2'], ['D1', 'D2'], ['E1', 'E2']]);

    setTimeout(function () {
      var $addedCell = $(getCell(5, 1));

      expect($addedCell.hasClass('htInvalid')).toEqual(true);

      done();
    }, 100);
  });

  describe('copy-paste functionality', function () {
    var DataTransferObject = function () {
      function DataTransferObject() {
        _classCallCheck(this, DataTransferObject);

        this.data = {
          'text/plain': '',
          'text/html': ''
        };
      }

      _createClass(DataTransferObject, [{
        key: 'getData',
        value: function getData(type) {
          return this.data[type];
        }
      }, {
        key: 'setData',
        value: function setData(type, value) {
          this.data[type] = value;
        }
      }]);

      return DataTransferObject;
    }();

    function getClipboardEventMock() {
      var event = {};
      event.clipboardData = new DataTransferObject();
      event.preventDefault = function () {};
      return event;
    }

    it('should skip trimmed rows, while copying data', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: [1, 5, 6, 7, 8],
        width: 500,
        height: 300
      });

      var copyEvent = getClipboardEventMock('copy');
      var plugin = hot.getPlugin('CopyPaste');

      selectCell(0, 0, 4, 9);

      plugin.setCopyableText();
      plugin.onCopy(copyEvent);

      /* eslint-disable no-tabs */
      expect(copyEvent.clipboardData.getData('text/plain')).toEqual('A1	B1	"C1\n' + 'line"	D1	E1	F1	G1	H1	I1	J1\n' + 'A3	B3	C3	D3	E3	F3	G3	H3	I3	J3\n' + 'A4	B4	C4	D4	E4	F4	G4	H4	I4	J4\n' + 'A5	B5	C5	D5	E5	F5	G5	H5	I5	J5\n' + 'A10	B10	C10	D10	E10	F10	G10	H10	I10	J10');
    });
  });

  describe('navigation', function () {
    it('should ignore trimmed rows while navigating by arrow keys', function () {
      handsontable({
        data: getMultilineData(50, 10),
        trimRows: [1, 5, 6, 7, 8],
        width: 500,
        height: 300
      });

      selectCell(0, 0, 0, 0);

      expect(getValue()).toEqual('A1');

      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_DOWN);

      expect(getValue()).toEqual('A3');

      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_DOWN);

      expect(getValue()).toEqual('A4');

      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_DOWN);

      expect(getValue()).toEqual('A5');

      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_DOWN);

      expect(getValue()).toEqual('A10');
    });
  });

  describe('column sorting', function () {
    it('should remove correct rows after sorting', function () {
      handsontable({
        data: getMultilineData(5, 10),
        columnSorting: {
          initialConfig: {
            column: 0,
            sortOrder: 'desc'
          }
        },
        trimRows: [1],
        width: 500,
        height: 300
      });
      alter('remove_row', 2, 1);

      expect(getDataAtCell(0, 0)).toBe('A5');
      expect(getDataAtCell(1, 0)).toBe('A4');
      expect(getDataAtCell(2, 0)).toBe('A1');
    });

    it('should remove correct rows after insert new rows in sorted column', function (done) {
      handsontable({
        data: getMultilineData(5, 10),
        colHeaders: true,
        columnSorting: {
          initialConfig: {
            column: 0,
            sortOrder: 'desc'
          }
        },
        trimRows: [1],
        width: 500,
        height: 300
      });

      setTimeout(function () {
        alter('insert_row', 2, 1);
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mousedown');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mouseup');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('click');
        alter('remove_row', 2, 1);

        expect(getDataAtCell(0, 0)).toBe('A1');
        expect(getDataAtCell(1, 0)).toBe('A3');
        expect(getDataAtCell(2, 0)).toBe('A5');
        expect(getDataAtCell(3, 0)).toBe(null);
        done();
      }, 100);
    });

    it('should remove correct rows after insert new rows in sorted column (multiple sort click)', function (done) {
      handsontable({
        data: getMultilineData(5, 10),
        colHeaders: true,
        columnSorting: {
          initialConfig: {
            column: 0,
            sortOrder: 'desc'
          }
        },
        trimRows: [1],
        width: 500,
        height: 300
      });

      setTimeout(function () {
        alter('insert_row', 2, 1);
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mousedown');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mouseup');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('click');
        alter('insert_row', 0, 1);
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mousedown');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mouseup');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('click');
        alter('remove_row', 0, 3);

        expect(getDataAtCell(0, 0)).toBe('A1');
        expect(getDataAtCell(1, 0)).toBe(null);
        expect(getDataAtCell(2, 0)).toBe(null);
        expect(getDataAtCell(3, 0)).toBe(null);
        done();
      }, 100);
    });
  });

  describe('maxRows option set', function () {
    it('should return properly data after trimming', function (done) {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        maxRows: 3,
        trimRows: [2, 3]
      });

      setTimeout(function () {
        expect(getData().length).toEqual(3);
        expect(getDataAtCell(2, 1)).toEqual('B5');
        done();
      }, 100);
    });
  });

  describe('minRows option set', function () {
    it('should not fill the table with empty rows (to the `minRows` limit), when editing rows in a table with trimmed rows', function (done) {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        minRows: 10,
        trimRows: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      });

      expect(hot.countRows()).toEqual(1);

      hot.setDataAtCell(0, 0, 'test');

      setTimeout(function () {
        expect(hot.countRows()).toEqual(1);

        done();
      }, 100);
    });
  });

  describe('minSpareRows option set', function () {
    it('should not fill the table with empty rows (to the `minSpareRows` limit), when editing rows in a table with trimmed rows', function (done) {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        minSpareRows: 4,
        trimRows: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      });

      expect(hot.countRows()).toEqual(1);

      hot.setDataAtCell(0, 0, 'test');

      setTimeout(function () {
        expect(hot.countRows()).toEqual(1);

        done();
      }, 100);
    });
  });

  describe('updateSettings', function () {
    it('should update list of trimmed rows when array of indexes is passed to the method - test no. 1', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: [2, 6, 7],
        width: 500,
        height: 300
      });
      hot.updateSettings({
        trimRows: [1, 2, 3, 4, 5]
      });

      expect(getDataAtCell(0, 0)).toBe('A1');
      expect(getDataAtCell(1, 0)).toBe('A7');
      expect(getDataAtCell(2, 0)).toBe('A8');
      expect(getDataAtCell(3, 0)).toBe('A9');
      expect(getDataAtCell(4, 0)).toBe('A10');
    });

    it('should update list of trimmed rows when array of indexes is passed to the method - test no. 2', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: true,
        width: 500,
        height: 300
      });

      hot.getPlugin('trimRows').trimRows([2, 6, 7]);
      hot.render();

      hot.updateSettings({
        trimRows: [1, 2, 3, 4, 5]
      });

      expect(getDataAtCell(0, 0)).toBe('A1');
      expect(getDataAtCell(1, 0)).toBe('A7');
      expect(getDataAtCell(2, 0)).toBe('A8');
      expect(getDataAtCell(3, 0)).toBe('A9');
      expect(getDataAtCell(4, 0)).toBe('A10');
    });

    it('should clear list of trimmed rows when empty array is passed to the method - test no. 1', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: [2, 6, 7],
        width: 500,
        height: 300
      });

      hot.updateSettings({
        trimRows: []
      });

      expect(this.$container.find('td').length).toEqual(100);
    });

    it('should clear list of trimmed rows when empty array is passed to the method - test no. 2', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: true,
        width: 500,
        height: 300
      });

      hot.getPlugin('trimRows').trimRows([2, 6, 7]);
      hot.render();

      hot.updateSettings({
        trimRows: []
      });

      expect(this.$container.find('td').length).toEqual(100);
    });

    it('should clear list of trimmed rows when handled setting object has key `trimRows` with value ' + 'set to `false` - test no. 1', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: [2, 6, 7],
        width: 500,
        height: 300
      });

      hot.updateSettings({
        trimRows: false
      });

      expect(this.$container.find('td').length).toEqual(100);
    });

    it('should clear list of trimmed rows when handled setting object has key `trimRows` with value ' + 'set to `false` - test no. 2', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: true,
        width: 500,
        height: 300
      });

      hot.getPlugin('trimRows').trimRows([2, 6, 7]);
      hot.render();

      hot.updateSettings({
        trimRows: false
      });

      expect(this.$container.find('td').length).toEqual(100);
    });

    it('shouldn\'t clear list of trimmed rows when handled setting object has key `trimRows` with value ' + 'set to `true` - test no. 1', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: [2, 6, 7],
        width: 500,
        height: 300
      });

      hot.updateSettings({
        trimRows: true
      });

      expect(getData().length).toEqual(7);
    });

    it('shouldn\'t clear list of trimmed rows when handled setting object has key `trimRows` with value ' + 'set to `true` - test no. 2', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: true,
        width: 500,
        height: 300
      });

      hot.getPlugin('trimRows').trimRows([2, 6, 7]);
      hot.render();

      hot.updateSettings({
        trimRows: true
      });

      expect(getData().length).toEqual(7);
    });

    it('shouldn\'t change list of trimmed rows when handled setting object don\'t have `trimRows` key - test no. 1', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: [2, 6, 7],
        width: 500,
        height: 300
      });

      hot.updateSettings({});

      hot.render();

      expect(getData().length).toEqual(7);
    });

    it('shouldn\'t change list of trimmed rows when handled setting object don\'t have `trimRows` key - test no. 2', function () {
      var hot = handsontable({
        data: getMultilineData(10, 10),
        trimRows: true,
        width: 500,
        height: 300
      });

      hot.getPlugin('trimRows').trimRows([2, 6, 7]);
      hot.render();
      hot.updateSettings({});

      expect(getData().length).toEqual(7);
    });
  });
});