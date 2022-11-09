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

const header = {
  state: true,
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

const ids = {
  state: [],
  reducers: {
    'id/onChange': (state, payload) => {
      const exist = state.filter(item => item === payload)

      if (exist.length) {
        return [...state]
      }

      return [...state, payload]
    },
    onChange(state, payload) {
      return payload
    },
    removeTag(state, payload) {
      return state.filter(item => item !== payload)
    },
    removeTagAndRedirect(state, payload) {
      const newState = state.filter(item => item !== payload)
      window.location.href = `/#/report/${newState[0]}`
      return newState
    }
  }
}

export default {
  id,
  ids,
  visible,
  header
}
