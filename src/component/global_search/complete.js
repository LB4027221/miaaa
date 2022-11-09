import React from 'react'
import { compose, lifecycle } from 'recompose'
import { Icon, Input, AutoComplete, Modal } from 'antd'
import { connect } from 'react-redux'
import search$ from '@lib/keyboard/search'
import { withUserReports } from '@gql'
import { renderNothingByName } from '@lib'
import store from './store'

import withStyles from './styles'

const toggle = () => store.dispatch({
  type: 'visible/toggle'
})

let auto
const setRef = ref => auto = ref

const onPressEnter = (e) => {
  window.location.href = `#/search?q=${e.target.value}`
}

const onPressEnterAndToggle = (e) => {
  onPressEnter(e)
  toggle()
}

const Complete = ({
  classes,
  dataSource,
  keywords,
  visible,
  onSearch
}) => (
  <div className='certain-category-search-wrapper' style={{ width: 250 }}>
    <Modal
      wrapClassName='vertical-center-modal'
      visible={visible}
      onCancel={toggle}
      footer={null}
    >
      <AutoComplete
        ref={setRef}
        className={classes.container}
        dropdownClassName='certain-category-search-dropdown'
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 300 }}
        size='large'
        style={{ width: '100%' }}
        dataSource={dataSource}
        optionLabelProp='text'
        value={keywords}
        onSearch={onSearch}
        // onChange={console.log}
        // onFocus={console.log}
      >
        <Input
          onPressEnter={onPressEnterAndToggle}
          value={keywords}
          prefix={<Icon type='search' className='certain-category-icon' />}
        />
      </AutoComplete>
    </Modal>
    <AutoComplete
      className={classes.container}
      dropdownClassName='certain-category-search-dropdown'
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ width: 300 }}
      size='large'
      style={{ width: '100%' }}
      dataSource={dataSource}
      optionLabelProp='text'
      value={keywords.replace(/\s/g, '')}
      onChange={onSearch}
    >
      <Input
        placeholder='按 d + f 快速搜索'
        onPressEnter={onPressEnter}
        prefix={<Icon type='search' className='certain-category-icon' />}
      />
    </AutoComplete>
  </div>
)

const mapState = state => ({
  dataSource: state.dataSource[1],
  keywords: state.keywords,
  visible: state.visible
})

const mapDispatch = ({
  keywords: { onSearch },
  dataSource: { init }
}) => ({
  onSearch,
  init
})

const init = lifecycle({
  componentDidMount() {
    this.props.init(this.props.userReports.user.reports)
  }
})

search$.subscribe((codes) => {
  if (codes) {
    toggle()
    setTimeout(() => {
      auto.focus()
    }, 200)
  }
})

export default compose(
  withStyles,
  withUserReports,
  renderNothingByName('userReports'),
  connect(mapState, mapDispatch),
  init
)(Complete)
