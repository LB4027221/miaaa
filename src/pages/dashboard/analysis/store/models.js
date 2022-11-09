const visible = {
  state: false,
  reducers: {
    'modalBody/onChange': () => true,
    edit() {
      return true
    },
    toggle(state) {
      return !state
    },
    open() {
      return true
    },
    success() {
      return false
    }
  }
}
const modalBody = {
  state: null,
  reducers: {
    onChange(state, payload) {
      return payload.comp
    }
  }
}
const worksheet = {
  state: null,
  reducers: {
    'modalBody/onChange': (state, payload) => {
      return payload.worksheet
    }
  }
}

export default {
  visible,
  modalBody,
  worksheet
}
