const id = {
  state: '',
  reducers: {
    onChange(state, payload) {
      return payload
    },
    removeTagAndRedirect(state, payload) {
      return payload
    }
  }
}
const columns = {
  state: [],
  reducers: {
    onChange(state, payload) {
      return payload
    },
    addCol(state, payload) {
      return [...state, payload]
    }
  }
}
const timeHandler = {
  state: null,
  reducers: {
    onChange(state, payload) {
      return payload
    }
  }
}
const dateRange = {
  state: null,
  reducers: {
    onChange(state, payload) {
      return payload
    }
  }
}

const visible = {
  state: false,
  reducers: {
    toggleModal(state) {
      return !state
    }
  }
}

const pageSize = {
  state: 100,
  reducers: {
    onChange(state, payload) {
      return payload.target.value
    }
  }
}

export default {
  pageSize,
  id,
  visible,
  columns,
  dateRange,
  timeHandler
}
