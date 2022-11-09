import { init } from '@rematch/core'
import R from 'ramda/src'

const indexByKey = R.indexBy(R.prop('key'))
const merge = R.useWith(
  R.merge,
  [indexByKey, R.identity]
)
const mergeState = R.pipe(merge, R.values)

const delByKey = R.converge(
  R.reject,
  [R.pipe(R.nthArg(0), R.propEq('key')), R.nthArg(1)]
)
const SQL = {
  state: '',
  reducers: {
    writeSQL: (state, payload) => payload
  }
}
const cname = {
  state: '',
  reducers: {
    writeCname: (state, payload) => payload
  }
}
const countSQL = {
  state: '',
  reducers: {
    writeCountSQL: (state, payload) => payload
  }
}
const component = {
  state: [],
  reducers: {
    init: (state, payload) => payload,
    addComponent: (state, payload) => R.concat(state, [payload]),
    setComponent: (state, payload) => mergeState(state, { [payload.key]: payload }),
    delComponent: (state, payload) => delByKey(payload)(state),
    clearComponent: state => R.empty(state)
  }
}

const editComp = {
  state: {},
  reducers: {
    updateComponent: (state, payload) => payload
  }
}

const modal = {
  state: {
    rangePickerVisible: false,
    datePickerVisible: false
  },
  reducers: {
    toggleRangePicker: state => R.evolve({ rangePickerVisible: R.not }, state),
    toggleDatePicker: state => R.evolve({ datePickerVisible: R.not }, state)

  }
}


const store = init({
  models: {
    component,
    editComp,
    modal,
    SQL,
    cname,
    countSQL
  }
})

export default store

