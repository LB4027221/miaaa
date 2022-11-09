import React from 'react'
import { Modal, Transfer } from 'antd'
import { connect } from 'react-redux'
import { withUser, withUserReports, withEditFavorite } from '@gql'
import { compose, withProps, lifecycle } from 'recompose'
import mutate from '@lib/mutate'
import { withApollo } from 'react-apollo'
import { editFavoriteMutate } from './handle'

const View = ({
  visible,
  toggle,
  groupName,
  dataSource,
  selectedKeys,
  targetKeys,
  onChange,
  onSelectChange,
  mutatehoc,
  onOk
}) => (
  <Modal
    title='我的收藏'
    visible={visible}
    onCancel={toggle}
    onOk={onOk}
    okText='提交'
    cancelText='取消'
    width={700}
    confirmLoading={mutatehoc.loading}
  >
    <br />
    <Transfer
      showSearch
      listStyle={{
        width: 300,
        height: 300
      }}
      searchPlaceholder='搜索'
      dataSource={dataSource}
      titles={['可选列表', groupName]}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={(sourceSelectedKeys, targetSelectedKeys) =>
        onSelectChange([...targetSelectedKeys, ...sourceSelectedKeys])}
      render={item => item.title}
    />
  </Modal>
)

const mapState = state => ({
  visible: state.favoriteVisible,
  selectedKeys: state.favoriteSelectedKeys,
  targetKeys: state.favoriteTargetKeys
})
const mapDispatch = ({
  favoriteVisible: { toggle, success },
  favoriteTargetKeys: { onChange },
  favoriteSelectedKeys: { onSelectChange }
}) => ({
  onChange,
  onSelectChange,
  toggle,
  success
})

const mapDataSource = withProps(props => ({
  dataSource: props.userReports.user.reports.map(item => ({
    key: item._id,
    title: item.cname,
    description: item.remarks
  }))
}))

const setDefaultTargetKeys = lifecycle({
  componentDidMount() {
    this.props.onChange(this.props.data.user.favorite)
  }
})

export default compose(
  withApollo,
  withUser,
  withUserReports,
  connect(mapState, mapDispatch),
  mapDataSource,
  withEditFavorite,
  mutate({ mutationName: 'editFavorite', name: 'mutatehoc' }),
  editFavoriteMutate,
  setDefaultTargetKeys
)(View)
