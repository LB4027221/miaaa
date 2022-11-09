import React from 'react'
import { Table, Card, Button, Icon, Badge, Tag, Divider } from 'antd'
import { compose } from 'recompose'
import map from 'ramda/src/map'
import filter from 'ramda/src/filter'
import prop from 'ramda/src/prop'
import defaultTo from 'ramda/src/defaultTo'
import evolve from 'ramda/src/evolve'
import head from 'ramda/src/head'
import rCompose from 'ramda/src/compose'
import moment from 'moment'
import { pinyin } from '@lib'
import withTitle from '@component/title'
import withRefetch from '@lib/refetch'
import mutate from '@lib/mutate'

import { Consumer } from './context'

import Tools from './tools'
import withData, { withToggleOnline } from './gql'

import withStyle from './styles'

const mapUser = rCompose(
  defaultTo('admin'),
  prop('userName')
)

const dateStyle = {
  color: '#aaa',
  fontSize: 12
}

const usedOn = {
  songxiaocai: <Tag key='songxiaocai' color='orange'>宋小菜</Tag>,
  songxiaofu: <Tag key='songxiaofu' color='blue'>宋小福</Tag>,
  songxiaocang: <Tag key='songxiaocang' color='green'>宋小仓</Tag>,
  caimi: <Tag key='caimi' color='green'>采秘</Tag>,
  maidashu: <Tag key='maidashu' color='green'>麦大蔬</Tag>,
  'songxiaocai-siji': <Tag key='songxiaocai-siji' color='green'>宋小菜-司机</Tag>,
  yunzhanggui: <Tag key='yunzhanggui' color='purple'>云掌柜</Tag>
}

const tagsToCn = {
  tongji: '统计',
  detail: '详情',
  detailTab: '详情Tab',
  tongjiTab: '统计Tab',
  jiugongge: '九宫格'
}

const tags = (item, index) => <Tag key={index} >{tagsToCn[item]}</Tag>

const statusMap = {
  1: {
    type: 'processing',
    text: '待处理'
  },
  2: {
    type: 'warning',
    text: '处理中'
  },
  3: {
    type: 'success',
    text: '运行中'
  },
  4: {
    type: 'default',
    text: '关闭'
  }
}

const filterBySearch = search => filter(item =>
  item.cname.includes(search) || pinyin(item.cname).map(head).join('').includes(search))

const mapObj = map(evolve({
  user: mapUser,
  editor: mapUser
}))

const mapDataSource = search => rCompose(
  mapObj,
  filterBySearch(search)
)

const columns = (toggleOnline, refetchdata) => [{
  title: '表名',
  dataIndex: 'cname',
  key: 'cname',
  filters: [
    { text: 'Web', value: 'web' },
    { text: 'App', value: 'app' },
    { text: '宋小福', value: 'songxiaofu' },
    { text: '宋小菜', value: 'songxiaocai' },
    { text: '宋小仓', value: 'songxiaocang' },
    { text: '宋大仓', value: 'songdacang' },
    { text: '宋小菜-司机', value: 'songxiaocai-siji' },
    { text: '采秘', value: 'caimi' },
    { text: '麦大蔬', value: 'maidashu' },
    { text: '云掌柜', value: 'yunzhanggui' }
  ],
  onFilter: (value, record) => {
    if (value === 'web') {
      return !record.usedOn.length
    }

    if (value === 'app') {
      return record.usedOn.length
    }

    return record.usedOn.includes(value)
  },
  render: (val, record) => (
    <div>
      <div>{record.cname}</div>
      <div>
        <span>{record.usedOn.map(item => usedOn[item])}</span>
        <span>{record.tags.map(tags)}</span>
      </div>
    </div>
  )
}, {
  title: '提交人',
  dataIndex: 'user',
  key: 'user',
  render: (val, record) => (
    <div>
      <div>{record.user}</div>
      <div><span style={dateStyle}>{moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</span></div>
    </div>
  ),
  sorter: (prev, next) => moment(prev.createAt).valueOf() - moment(next.createAt).valueOf()
}, {
  title: '修改人',
  dataIndex: 'editor',
  key: 'editor',
  defaultSortOrder: 'descend',
  render: (val, record) => (
    <div>
      <div>{record.editor}</div>
      <div><span style={dateStyle}>{moment(record.updateAt).format('YYYY-MM-DD HH:mm:ss')}</span></div>
    </div>
  ),
  sorter: (prev, next) => moment(prev.updateAt).valueOf() - moment(next.updateAt).valueOf()
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  filters: [
    { text: '待处理', value: 1 },
    { text: '运行中', value: 3 },
    { text: '关闭', value: 4 }
  ],
  onFilter: (value, record) => {
    console.log(record.status === Number(value))
    return record.status === Number(value)
  },
  render: val => (
    <Badge status={statusMap[val].type} text={statusMap[val].text} />
  )
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href={`/#/requirement/machiningList/edit/${record.key}`}>更新</a>
      <Divider type='vertical' />
      <a href={`/#/report/${record.key}`}>查看</a>
      <Divider type='vertical' />
      {record.__typename === 'Report' && <a href={`/#/requirement/machiningList/machiningView/${record.key}`}>修改</a>}
      {record.__typename === 'Master' && <a href={`/#/requirement/machiningList/machiningMasterView/${record.key}`}>修改</a>}
      <Divider type='vertical' />
      <br />
      <a href={`/#/tplEdit/${record.key}`}>Excel 模板</a>
      {/* <Divider type='vertical' /> */}
      {/* <a href={`/#/chartEdit/${record.key}`}>可视化入口</a> */}
    </span>
  )
}, {
  title: '上线/下线',
  key: 'online',
  render: (text, record) => (
    <span>
      {record.status === 4
        && <Button
          onClick={() => toggleOnline.submit({ reportId: record.key }, () => refetchdata())}
          type='danger'
        >上线</Button>
      }
      {record.status !== 4
        && <Button
          onClick={() => toggleOnline.submit({ reportId: record.key }, () => refetchdata())}
          type='danger'
        >下线</Button>
      }
    </span>
  )
}]

const View = ({
  data,
  search,
  dataRefetching,
  refetchdata,
  mutatehoc
}) => (
  <Card bordered={false} hoverable>
    <Tools />
    <Button type='primary' href='/#/requirement/list/new'>
      <Icon type='plus' />
      {' 提个新需求'}
    </Button>
    <Button
      style={{ marginLeft: 20 }}
      shape='circle'
      icon='reload'
      loading={data.loading || dataRefetching}
      onClick={refetchdata}
    />
    <br />
    <br />
    <Table
      loading={data.loading}
      dataSource={mapDataSource(search)(data.reports || [])}
      columns={columns(mutatehoc, refetchdata)}
    />
  </Card>
)

const withCtx = BaseComp => props => (
  <Consumer>
    {ctx => <BaseComp {...props} search={ctx.search} />}
  </Consumer>
)

export default compose(
  withToggleOnline,
  mutate({ mutationName: 'toggleOnline', name: 'mutatehoc' }),
  withTitle('我的需求'),
  withStyle,
  withData,
  withCtx,
  withRefetch('data')
)(View)
