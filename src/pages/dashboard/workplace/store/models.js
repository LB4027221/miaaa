const visible = {
  state: false,
  reducers: {
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

const groupId = {
  state: '',
  reducers: {
    'visible/edit': (state, payload) => payload._id,
    'visible/success': () => '',
    'visible/open': () => ''
  }
}

const groupName = {
  state: '新建分组',
  reducers: {
    'visible/edit': (state, payload) => payload.name,
    'visible/success': () => '新建分组',
    'visible/open': () => '新建分组',
    onChange(state, payload) {
      return payload
    }
  }
}

const selectedKeys = {
  state: [],
  reducers: {
    'visible/success': () => [],
    'visible/open': () => [],
    onSelectChange(state, payload) {
      return [...payload]
    }
  }
}

const targetKeys = {
  state: [],
  reducers: {
    'visible/edit': (state, payload) => payload.reportIds,
    'visible/success': () => [],
    'visible/open': () => [],
    onChange(state, payload) {
      return payload
    }
  }
}

const favoriteVisible = {
  state: false,
  reducers: {
    edit() {
      return true
    },
    toggle(state) {
      return !state
    },
    success() {
      return false
    }
  }
}

const favoriteSelectedKeys = {
  state: [],
  reducers: {
    'favoriteVisible/success': () => [],
    onSelectChange(state, payload) {
      return [...payload]
    }
  }
}

const favoriteTargetKeys = {
  state: [],
  reducers: {
    onChange(state, payload) {
      return payload
    }
  }
}

export default {
  favoriteVisible,
  favoriteSelectedKeys,
  favoriteTargetKeys,
  groupName,
  groupId,
  selectedKeys,
  targetKeys,
  visible
}
