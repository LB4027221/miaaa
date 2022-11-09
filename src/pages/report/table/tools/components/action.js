import store from '../../../store'

const { dispatch } = store
const handleInput = (reportId, _id) => (e) => {
  const report = store.getState()[reportId]
  const payload = {
    components: {
      ...report.components,
      [_id]: e.target.value
        ? [`'%${e.target.value}%'`, e.target.value]
        : []
    }
  }

  return dispatch({
    type: `${reportId}/onChange`,
    payload
  })
}

const handleSelect = (reportId, _id) => (value) => {
  const report = store.getState()[reportId]
  const payload = {
    components: {
      ...report.components,
      [_id]: [value]
    }
  }

  return dispatch({
    type: `${reportId}/onChange`,
    payload
  })
}

const handlePickDate = (reportId, _id) => (date, dateString) => {
  const report = store.getState()[reportId]
  const payload = {
    components: {
      ...report.components,
      [_id]: date.length
        ? [`'${dateString[0]} 00:00:00'`, `'${dateString[1]} 23:59:59'`]
        : []
    }
  }

  return dispatch({
    type: `${reportId}/onChange`,
    payload
  })
}

const handleDateChange = (reportId, _id) => (date, dateString) => {
  const report = store.getState()[reportId]
  const payload = {
    components: {
      ...report.components,
      [_id]: date
        ? [`'${dateString}'`]
        : []
    }
  }

  return dispatch({
    type: `${reportId}/onChange`,
    payload
  })
}

const mapWhere = where => (where.length && where[0]
  ? where[0]
  : where[0])
const mapInput = where => (where.length && where[0]
  ? where[1]
  : where[0])

export {
  mapInput,
  mapWhere,
  handleInput,
  handleSelect,
  handlePickDate,
  handleDateChange
}
