import React from 'react'
import { Modal, Transfer, Input } from 'antd'
import { connect } from 'react-redux'
import { withUser, withUserReports, withAddReportsGroup, withUpdateReportsGroup } from '@gql'
import { compose, withProps } from 'recompose'
import mutate from '@lib/mutate'
import { withApollo } from 'react-apollo'
import { mapMutate } from './handle'

const View = ({
  visible,
  toggle,
  groupName,
  dataSource,
  selectedKeys,
  targetKeys,
  onChange,
  onSelectChange,
  changeName,
  addReportsGroupMutatehoc,
  onOk
}) => (
  <Modal
    title='新建报表分组'
    visible={visible}
    onCancel={toggle}
    onOk={onOk}
    okText='提交'
    cancelText='取消'
    width={700}
    confirmLoading={addReportsGroupMutatehoc.loading}
  >
    <Input value={groupName} onChange={e => changeName(e.target.value)} />
    <br />
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
  visible: state.visible,
  groupId: state.groupId,
  groupName: state.groupName,
  selectedKeys: state.selectedKeys,
  targetKeys: state.targetKeys
})
const mapDispatch = ({
  visible: { toggle, success },
  targetKeys: { onChange },
  groupName: { onChange: changeName },
  selectedKeys: { onSelectChange }
}) => ({
  onChange,
  changeName,
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

export default compose(
  withApollo,
  withUser,
  withUserReports,
  connect(mapState, mapDispatch),
  mapDataSource,
  withAddReportsGroup,
  withUpdateReportsGroup,
  mutate({ mutationName: 'addReportsGroup', name: 'addReportsGroupMutatehoc' }),
  mutate({ mutationName: 'updateReportsGroup', name: 'updateReportsGroupMutatehoc' }),
  mapMutate
)(View)
