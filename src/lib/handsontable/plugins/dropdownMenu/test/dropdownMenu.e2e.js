function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('DropdownMenu', function () {
  var id = 'testContainer';

  beforeEach(function () {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('enable/disable plugin', function () {
    it('should disable plugin after call disablePlugin method', function () {
      var hot = handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      expect(hot.view.wt.wtTable.getColumnHeader(0).querySelector('.changeType')).not.toBe(null);

      hot.getPlugin('dropdownMenu').disablePlugin();
      hot.render();

      expect(hot.view.wt.wtTable.getColumnHeader(0).querySelector('.changeType')).toBe(null);
    });

    it('should enable plugin after call enablePlugin method', function () {
      var hot = handsontable({
        dropdownMenu: false,
        colHeaders: true,
        height: 100
      });

      expect(hot.view.wt.wtTable.getColumnHeader(0).querySelector('.changeType')).toBe(null);

      hot.getPlugin('dropdownMenu').enablePlugin();
      hot.render();

      expect(hot.view.wt.wtTable.getColumnHeader(0).querySelector('.changeType')).not.toBe(null);
    });
  });

  describe('menu width', function () {
    it('should display the menu with the minimum width', _asyncToGenerator(function* () {
      handsontable({
        colHeaders: true,
        dropdownMenu: {
          items: {
            custom1: {
              name: 'a'
            },
            custom2: {
              name: 'b'
            }
          }
        }
      });

      var $menu = $('.htDropdownMenu');

      dropdownMenu(0);

      expect($menu.find('.wtHider').width()).toEqual(215);
    }));

    it('should display a submenu with the minimum width', _asyncToGenerator(function* () {
      handsontable({
        colHeaders: true,
        dropdownMenu: {
          items: {
            custom1: {
              name: 'a'
            },
            custom2: {
              name: function name() {
                return 'Menu';
              },

              submenu: {
                items: [{ name: function name() {
                    return 'Submenu';
                  } }]
              }
            }
          }
        }
      });

      dropdownMenu(0);

      var $item = $('.htDropdownMenu .ht_master .htCore').find('tbody td').not('.htSeparator').eq(1);

      $item.simulate('mouseover');

      yield sleep(300);

      var $contextSubMenu = $('.htDropdownMenuSub_' + $item.text());

      expect($contextSubMenu.find('.wtHider').width()).toEqual(215);
    }));
  });

  describe('menu opening', function () {
    it('should open menu after click on table header button', function () {
      var hot = handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      expect(hot.getPlugin('dropdownMenu')).toBeDefined();
      expect($('.htDropdownMenu').is(':visible')).toBe(false);

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(true);
    });

    it('should open menu after click on table header button when only header cells are visible', function () {
      handsontable({
        data: [],
        colHeaders: ['Year', 'Kia'],
        columns: [{ data: 0 }, { data: 1 }],
        dropdownMenu: true,
        height: 100
      });

      expect($('.htDropdownMenu').is(':visible')).toBe(false);

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(true);
    });
  });

  describe('menu closing', function () {
    it('should close menu after click', function () {
      handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(true);

      mouseDown(this.$container);

      expect($('.htDropdownMenu').is(':visible')).toBe(false);
    });
  });

  describe('menu disabled', function () {
    it('should not open menu after table header button click', function () {
      var hot = handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      hot.getPlugin('dropdownMenu').disablePlugin();
      hot.render();

      expect($('.htDropdownMenu').is(':visible')).toBe(false);

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(false);
      expect(hot.view.wt.wtTable.getColumnHeader(0).querySelector('.changeType')).toBe(null);
    });

    it('should not create dropdowm menu if it\'s disabled in constructor options', function () {
      var hot = handsontable({
        dropdownMenu: false,
        colHeaders: true,
        height: 100
      });

      expect(hot.getPlugin('dropdownMenu').isEnabled()).toBe(false);
      expect(hot.view.wt.wtTable.getColumnHeader(0).querySelector('.changeType')).toBe(null);
    });

    it('should reenable menu', function () {
      var hot = handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      hot.getPlugin('dropdownMenu').disablePlugin();

      expect($('.htDropdownMenu').is(':visible')).toBe(false);

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(false);

      hot.getPlugin('dropdownMenu').enablePlugin();

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(true);
    });

    it('should reenable menu with updateSettings when it was disabled in constructor', function () {
      var hot = handsontable({
        dropdownMenu: false,
        colHeaders: true,
        height: 100
      });

      expect(hot.getPlugin('dropdownMenu').isEnabled()).toBe(false);

      updateSettings({
        dropdownMenu: true
      });

      expect(hot.getPlugin('dropdownMenu').isEnabled()).toBe(true);

      expect($('.htDropdownMenu').is(':visible')).toBe(false);

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(true);
    });

    it('should disable menu with updateSettings when it was enabled in constructor', function () {
      var hot = handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      expect(hot.getPlugin('dropdownMenu').isEnabled()).toBe(true);

      updateSettings({
        dropdownMenu: false
      });

      expect(hot.getPlugin('dropdownMenu').isEnabled()).toBe(false);
    });
  });

  describe('menu destroy', function () {
    it('should close context menu when HOT is being destroyed', function () {
      handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      dropdownMenu(0);

      expect($('.htDropdownMenu').is(':visible')).toBe(true);

      destroy();

      expect($('.htDropdownMenu').is(':visible')).toBe(false);
    });
  });

  describe('default context menu actions', function () {
    it('should display the default set of actions', function () {
      handsontable({
        dropdownMenu: true,
        colHeaders: true,
        comments: true,
        height: 100
      });

      dropdownMenu();

      var items = $('.htDropdownMenu tbody td');
      var actions = items.not('.htSeparator');
      var separators = items.filter('.htSeparator');

      expect(actions.length).toEqual(6);
      expect(separators.length).toEqual(4);

      expect(actions.text()).toEqual(['Insert column left', 'Insert column right', 'Remove column', 'Clear column', 'Read only', 'Alignment'].join(''));
    });

    it('should insert column on the left of selection', function () {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        dropdownMenu: true,
        colHeaders: true,
        width: 400,
        height: 400
      });

      var afterCreateColCallback = jasmine.createSpy('afterCreateColCallback');
      hot.addHook('afterCreateCol', afterCreateColCallback);

      expect(countCols()).toEqual(4);

      dropdownMenu(2);

      // Insert col left
      $('.htDropdownMenu .ht_master .htCore').find('tbody td').not('.htSeparator').eq(0).simulate('mousedown');

      expect(afterCreateColCallback).toHaveBeenCalledWith(2, 1, 'ContextMenu.columnLeft', undefined, undefined, undefined);
      expect(countCols()).toEqual(5);
    });

    it('should Insert column right of selection', function () {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      var afterCreateColCallback = jasmine.createSpy('afterCreateColCallback');
      hot.addHook('afterCreateCol', afterCreateColCallback);

      expect(countCols()).toEqual(4);

      dropdownMenu(2);

      // Insert col right
      $('.htDropdownMenu .ht_master .htCore').find('tbody td').not('.htSeparator').eq(1).simulate('mousedown');

      expect(afterCreateColCallback).toHaveBeenCalledWith(3, 1, 'ContextMenu.columnRight', undefined, undefined, undefined);
      expect(countCols()).toEqual(5);
    });

    it('should remove column', function () {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      expect(countCols()).toEqual(4);

      dropdownMenu(1);

      // Clear column
      $('.htDropdownMenu .ht_master .htCore').find('tbody td').not('.htSeparator').eq(2).simulate('mousedown');

      expect(countCols()).toEqual(3);
    });

    it('should clear column data', function () {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      dropdownMenu(1);

      // Clear column
      $('.htDropdownMenu .ht_master .htCore').find('tbody td').not('.htSeparator').eq(3).simulate('mousedown');

      expect(hot.getDataAtCell(0, 0)).toBe('A1');
      expect(hot.getDataAtCell(1, 2)).toBe('C2');
      expect(hot.getDataAtCell(2, 3)).toBe('D3');
      expect(hot.getDataAtCell(0, 1)).toBeNull();
      expect(hot.getDataAtCell(1, 1)).toBeNull('');
      expect(hot.getDataAtCell(2, 1)).toBeNull('');
      expect(hot.getDataAtCell(3, 1)).toBeNull('');
    });

    it('should display only the specified actions', function () {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        dropdownMenu: ['clear_column'],
        colHeaders: true,
        height: 100
      });

      dropdownMenu(1);

      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').length).toEqual(1);
    });
  });

  describe('custom options', function () {
    it('should have custom items list', function () {

      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      handsontable({
        dropdownMenu: {
          items: {
            cust1: {
              name: 'CustomItem1',
              callback: callback1
            },
            cust2: {
              name: 'CustomItem2',
              callback: callback2
            }
          }
        },
        colHeaders: true,
        height: 100
      });

      dropdownMenu();

      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').length).toEqual(2);
      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').text()).toEqual(['CustomItem1', 'CustomItem2'].join(''));

      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(0)').simulate('mousedown');

      expect(callback1.calls.count()).toEqual(1);
      expect(callback2.calls.count()).toEqual(0);

      dropdownMenu();
      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(1)').simulate('mousedown');

      expect(callback1.calls.count()).toEqual(1);
      expect(callback2.calls.count()).toEqual(1);
    });

    it('should have custom items list (defined as a function)', function () {
      var enabled = false;
      handsontable({
        dropdownMenu: {
          items: {
            cust1: {
              name: function name() {
                if (enabled) {
                  return 'Disable my custom option';
                }

                return 'Enable my custom option';
              },
              callback: function callback() {}
            }
          }
        },
        colHeaders: true,
        height: 100
      });

      dropdownMenu();

      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').text()).toEqual('Enable my custom option');

      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(0)').simulate('mousedown');

      enabled = true;
      dropdownMenu();

      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').text()).toEqual('Disable my custom option');

      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(0)').simulate('mousedown');
    });

    it('should enable to define item options globally', function () {
      var callback = jasmine.createSpy('callback');

      handsontable({
        dropdownMenu: {
          callback: callback,
          items: {
            cust1: {
              name: 'CustomItem1'
            },
            cust2: {
              name: 'CustomItem2'
            }
          }
        },
        colHeaders: true,
        height: 100
      });

      dropdownMenu();

      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(0)').simulate('mousedown');

      expect(callback.calls.count()).toEqual(1);

      dropdownMenu();
      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(1)').simulate('mousedown');

      expect(callback.calls.count()).toEqual(2);
    });

    it('should override default items options', function () {
      var callback = jasmine.createSpy('callback');

      handsontable({
        dropdownMenu: {
          items: {
            remove_col: {
              callback: callback
            },
            column_clear: {
              name: 'CLEAR'
            }
          }
        },
        colHeaders: true,
        height: 100
      });

      dropdownMenu();

      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').length).toEqual(2);
      expect($('.htDropdownMenu .ht_master .htCore').find('tbody td').text()).toEqual(['Remove column', 'CLEAR'].join(''));

      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(0)').simulate('mousedown');

      expect(callback.calls.count()).toEqual(1);
    });

    it('should fire item callback after item has been clicked', function () {
      var customItem = {
        name: 'Custom item',
        callback: function callback() {}
      };

      spyOn(customItem, 'callback');

      handsontable({
        dropdownMenu: {
          items: {
            customItemKey: customItem
          }
        },
        colHeaders: true,
        height: 100
      });

      dropdownMenu();

      $('.htDropdownMenu .ht_master .htCore').find('tbody td:eq(0)').simulate('mousedown');

      expect(customItem.callback.calls.count()).toEqual(1);
      expect(customItem.callback.calls.argsFor(0)[0]).toEqual('customItemKey');
    });
  });

  describe('working with multiple tables', function () {
    beforeEach(function () {
      this.$container2 = $('<div id="' + id + '-2"></div>').appendTo('body');
    });

    afterEach(function () {
      if (this.$container2) {
        this.$container2.handsontable('destroy');
        this.$container2.remove();
      }
    });

    it('should apply enabling/disabling contextMenu using updateSetting only to particular instance of HOT', function () {
      var hot1 = handsontable({
        dropdownMenu: false,
        height: 100
      });
      var hot2 = this.$container2.handsontable({
        dropdownMenu: true,
        height: 100
      });

      hot2 = hot2.handsontable('getInstance');

      expect(hot1.getPlugin('dropdownMenu').isEnabled()).toBe(false);
      expect(hot2.getPlugin('dropdownMenu').isEnabled()).toBe(true);

      hot1.updateSettings({
        dropdownMenu: true
      });
      hot2.updateSettings({
        dropdownMenu: false
      });

      expect(hot1.getPlugin('dropdownMenu').isEnabled()).toBe(true);
      expect(hot2.getPlugin('dropdownMenu').isEnabled()).toBe(false);
    });
  });

  describe('afterDropdownMenuDefaultOptions hook', function () {
    it('should call with dropdown menu options as the first param', function () {
      var options = void 0;

      var afterDropdownMenuDefaultOptions = function afterDropdownMenuDefaultOptions(options_) {
        options = options_;
        options.items.cust1 = {
          name: 'My custom item',
          callback: function callback() {}
        };
      };

      Handsontable.hooks.add('afterDropdownMenuDefaultOptions', afterDropdownMenuDefaultOptions);

      handsontable({
        dropdownMenu: true,
        colHeaders: true,
        height: 100
      });

      dropdownMenu();

      var $menu = $('.htDropdownMenu .ht_master .htCore');

      expect(options).toBeDefined();
      expect(options.items).toBeDefined();
      expect($menu.find('tbody td').text()).toContain('My custom item');

      $menu.find('tbody td:eq(0)').simulate('mousedown');

      Handsontable.hooks.remove('afterDropdownMenuDefaultOptions', afterDropdownMenuDefaultOptions);
    });
  });

  describe('beforeDropdownMenuSetItems hook', function () {
    it('should add new menu item even when item is excluded from plugin settings', function () {
      var hot = void 0;

      Handsontable.hooks.add('beforeDropdownMenuSetItems', function (options) {
        if (this === hot || !hot) {
          options.push({
            key: 'test',
            name: 'Test'
          });
        }
      });

      hot = handsontable({
        colHeaders: true,
        dropdownMenu: ['make_read_only'],
        height: 100
      });

      dropdownMenu();

      var items = $('.htDropdownMenu tbody td');
      var actions = items.not('.htSeparator');

      expect(actions.text()).toEqual(['Read only', 'Test'].join(''));
    });

    it('should be called only with items selected in plugin settings', function () {
      var keys = [];
      var hot = void 0;

      Handsontable.hooks.add('beforeDropdownMenuSetItems', function (items) {
        if (this === hot || !hot) {
          keys = items.map(function (v) {
            return v.key;
          });
        }
      });

      hot = handsontable({
        colHeaders: true,
        dropdownMenu: ['make_read_only', 'col_left'],
        height: 100
      });

      dropdownMenu();

      expect(keys).toEqual(['make_read_only', 'col_left']);
    });
  });

  it('should be possible undo the alignment process by calling the \'Undo\' action without contextMenu', function () {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(9, 9),
      dropdownMenu: true
    });

    // top 3 rows center
    selectCell(0, 0, 2, 8);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:center');

    // middle 3 rows unchanged - left

    // bottom 3 rows right
    selectCell(6, 0, 8, 8);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:right');

    // left 3 columns - middle
    selectCell(0, 0, 8, 2);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:middle');

    // middle 3 columns unchanged - top

    // right 3 columns - bottom
    selectCell(0, 6, 8, 8);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:bottom');

    var cellMeta = hot.getCellMeta(0, 0);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();

    cellMeta = hot.getCellMeta(0, 7);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();

    cellMeta = hot.getCellMeta(5, 1);
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();

    cellMeta = hot.getCellMeta(5, 7);
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();

    cellMeta = hot.getCellMeta(7, 1);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();

    cellMeta = hot.getCellMeta(7, 5);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();

    cellMeta = hot.getCellMeta(7, 7);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();

    hot.undo();
    cellMeta = hot.getCellMeta(0, 7);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    expect(cellMeta.className.includes('htBottom')).toBeFalsy();

    cellMeta = hot.getCellMeta(5, 7);
    expect(cellMeta.className.includes('htBottom')).toBeFalsy();

    cellMeta = hot.getCellMeta(7, 7);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    expect(cellMeta.className.includes('htBottom')).toBeFalsy();

    hot.undo();

    cellMeta = hot.getCellMeta(0, 0);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    expect(cellMeta.className.includes('htMiddle')).toBeFalsy();

    cellMeta = hot.getCellMeta(5, 1);
    expect(cellMeta.className.includes('htMiddle')).toBeFalsy();

    cellMeta = hot.getCellMeta(7, 1);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    expect(cellMeta.className.includes('htMiddle')).toBeFalsy();

    hot.undo();

    cellMeta = hot.getCellMeta(7, 1);
    expect(cellMeta.className.includes('htRight')).toBeFalsy();
    expect(cellMeta.className.includes('htMiddle')).toBeFalsy();

    cellMeta = hot.getCellMeta(7, 5);
    expect(cellMeta.className.includes('htRight')).toBeFalsy();

    cellMeta = hot.getCellMeta(7, 7);
    expect(cellMeta.className.includes('htRight')).toBeFalsy();
    expect(cellMeta.className.includes('htBottom')).toBeFalsy();
  });

  it('should be possible redo the alignment process by calling the \'Redo\' action without contextMenu', function () {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(9, 9),
      dropdownMenu: true
    });

    // top 3 rows center
    selectCell(0, 0, 2, 8);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:center');

    // middle 3 rows unchanged - left

    // bottom 3 rows right
    selectCell(6, 0, 8, 8);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:right');

    // left 3 columns - middle
    selectCell(0, 0, 8, 2);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:middle');

    // middle 3 columns unchanged - top

    // right 3 columns - bottom
    selectCell(0, 6, 8, 8);
    hot.getPlugin('dropdownMenu').executeCommand('alignment:bottom');

    var cellMeta = hot.getCellMeta(0, 0);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();

    cellMeta = hot.getCellMeta(0, 7);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();

    cellMeta = hot.getCellMeta(5, 1);
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();

    cellMeta = hot.getCellMeta(5, 7);
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();

    cellMeta = hot.getCellMeta(7, 1);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();

    cellMeta = hot.getCellMeta(7, 5);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();

    cellMeta = hot.getCellMeta(7, 7);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();

    hot.undo();
    hot.undo();
    hot.undo();
    hot.undo();

    hot.redo();
    cellMeta = hot.getCellMeta(0, 0);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    cellMeta = hot.getCellMeta(1, 5);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    cellMeta = hot.getCellMeta(2, 8);
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();

    hot.redo();
    cellMeta = hot.getCellMeta(6, 0);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    cellMeta = hot.getCellMeta(7, 5);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
    cellMeta = hot.getCellMeta(8, 8);
    expect(cellMeta.className.includes('htRight')).toBeTruthy();

    hot.redo();
    cellMeta = hot.getCellMeta(0, 0);
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    cellMeta = hot.getCellMeta(5, 1);
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();
    cellMeta = hot.getCellMeta(8, 2);
    expect(cellMeta.className.includes('htMiddle')).toBeTruthy();
    expect(cellMeta.className.includes('htRight')).toBeTruthy();

    hot.redo();
    cellMeta = hot.getCellMeta(0, 6);
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();
    expect(cellMeta.className.includes('htCenter')).toBeTruthy();
    cellMeta = hot.getCellMeta(5, 7);
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();
    cellMeta = hot.getCellMeta(8, 8);
    expect(cellMeta.className.includes('htBottom')).toBeTruthy();
    expect(cellMeta.className.includes('htRight')).toBeTruthy();
  });
});