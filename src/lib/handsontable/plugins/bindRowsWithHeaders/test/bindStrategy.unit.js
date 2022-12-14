import BindStrategy from 'handsontable-pro/plugins/bindRowsWithHeaders/bindStrategy';

describe('BindRowsWithHeaders -> BindStrategy', function () {
  it('should throw error when used strategy is not exists', function () {
    var strategy = new BindStrategy();

    expect(function () {
      strategy.setStrategy('test2');
    }).toThrow();
  });

  it('should create a map based on `length` argument', function () {
    var strategyMock = { _arrayMap: [] };
    var strategy = new BindStrategy();

    strategy.strategy = strategyMock;
    strategy.createMap(4);

    expect(strategy.strategy._arrayMap[0]).toBe(0);
    expect(strategy.strategy._arrayMap[1]).toBe(1);
    expect(strategy.strategy._arrayMap[2]).toBe(2);
    expect(strategy.strategy._arrayMap[3]).toBe(3);
    expect(strategy.strategy._arrayMap[4]).toBe(void 0);
  });

  it('should re-create a map based on current map length', function () {
    var strategyMock = { _arrayMap: [] };
    var strategy = new BindStrategy();

    strategy.strategy = strategyMock;
    strategy.strategy._arrayMap[0] = 4;
    strategy.strategy._arrayMap[1] = 5;
    strategy.strategy._arrayMap[2] = 6;
    strategy.createMap();

    expect(strategy.strategy._arrayMap[0]).toBe(0);
    expect(strategy.strategy._arrayMap[1]).toBe(1);
    expect(strategy.strategy._arrayMap[2]).toBe(2);
    expect(strategy.strategy._arrayMap[3]).toBe(void 0);
  });

  it('should forward `createRow` method call to the strategy object', function () {
    var strategyMock = {
      createRow: function createRow() {}
    };
    var createRowSpy = jest.spyOn(strategyMock, 'createRow');
    var strategy = new BindStrategy();

    strategy.strategy = { createRow: createRowSpy };
    strategy.createRow(1, 1);

    expect(createRowSpy).toHaveBeenCalledTimes(1);
    expect(createRowSpy).toHaveBeenCalledWith(1, 1);

    strategy.createRow(3);

    expect(createRowSpy).toHaveBeenCalledTimes(2);
    expect(createRowSpy).toHaveBeenCalledWith(3);
  });

  it('should forward `removeRow` method call to the strategy object', function () {
    var strategyMock = {
      removeRow: function removeRow() {}
    };
    var removeRowSpy = jest.spyOn(strategyMock, 'removeRow');
    var strategy = new BindStrategy();

    strategy.strategy = { removeRow: removeRowSpy };
    strategy.removeRow(1, 1);

    expect(removeRowSpy).toHaveBeenCalledTimes(1);
    expect(removeRowSpy).toHaveBeenCalledWith(1, 1);

    strategy.removeRow(3);

    expect(removeRowSpy).toHaveBeenCalledTimes(2);
    expect(removeRowSpy).toHaveBeenCalledWith(3);
  });

  it('should forward `translate` method call to the strategy object', function () {
    var strategyMock = {
      getValueByIndex: function getValueByIndex() {}
    };
    var getValueByIndexSpy = jest.spyOn(strategyMock, 'getValueByIndex');
    var strategy = new BindStrategy();

    strategy.strategy = { getValueByIndex: getValueByIndexSpy };
    strategy.translate(1);

    expect(getValueByIndexSpy).toHaveBeenCalledTimes(1);
    expect(getValueByIndexSpy).toHaveBeenCalledWith(1);
  });

  it('should forward `clearMap` method call to the strategy object', function () {
    var strategyMock = {
      clearMap: function clearMap() {}
    };
    var clearMapSpy = jest.spyOn(strategyMock, 'clearMap');
    var strategy = new BindStrategy();

    strategy.strategy = { clearMap: clearMapSpy };
    strategy.clearMap();

    expect(clearMapSpy).toHaveBeenCalledTimes(1);
    expect(clearMapSpy).toHaveBeenCalledWith();
  });

  it('should destroy object after call `destroy` method', function () {
    var strategyMock = {
      destroy: function destroy() {}
    };
    var destroySpy = jest.spyOn(strategyMock, 'destroy');
    var strategy = new BindStrategy();

    strategy.strategy = { destroy: destroySpy };
    strategy.destroy();

    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(destroySpy).toHaveBeenCalledWith();
    expect(strategy.strategy).toBeNull();
  });
});