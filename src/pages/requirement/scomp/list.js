import React from 'react'
import { Table, Button } from 'antd'
import { Link } from 'react-router-dom'
import { withScomp } from '@gql'
import { compose } from 'recompose'
import withRefetch from '@lib/refetch'

const columns = [{
  title: '中文名称',
  dataIndex: 'cname',
  key: 'cname'
}, {
  title: 'SQL',
  dataIndex: 'sql',
  key: 'sql'
}, {
  title: '操作',
  dataIndex: 'edit',
  key: 'edit',
  render: (text, row) => (
    <Button>
      <Link to={`/requirement/scomp/${row.key}`}>修改</Link>
    </Button>
  )
}]

const View = ({ scomp, refetchscomp, scompRefetching }) => {
  const dataSource = scomp.scomp
    ? scomp.scomp
    : []

  return (
    <div>
      <div>
        <Button>
          <Link to='/requirement/scomp/new'>新建</Link>
        </Button>
        <Button
          style={{ marginLeft: 20 }}
          shape='circle'
          icon='reload'
          loading={scomp.loading || scompRefetching}
          onClick={refetchscomp}
        />
      </div>
      <Table
        loading={scomp.loading}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  )
}

export default compose(
  withScomp,
  withRefetch('scomp')
)(View)
