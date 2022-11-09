import React, { PureComponent } from 'react'
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon'
import { withNotice } from '@gql'
import { onlyUpdateForKeys, pure, compose } from 'recompose'
import moment from 'moment'
import { openHref } from '@component/page_header/download'

const mapData = data => ({
  type: 'message',
  datetime: moment(data.created).format('YYYY-MM-DD'),
  title: `${data.context.report}`,
  read: false,
  avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554141220457&di=5186161e06eac9b46eb126b48b5321d5&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F00%2F15%2F82%2F9356aec2a6832ef.jpg',
  data: { ...data }
})

class Notice extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      origins: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (!nextProps.loading && nextProps.data && nextProps.data.notice) {
      this.setState(({ list }) => ({ list: [mapData(nextProps.data.notice), ...list] }))
      this.setState(({ origins }) => ({ origins: [nextProps.data.notice, ...origins] }))
    }
  }

  onItemClick = (item) => {
    console.log(item)
    openHref({
      url: item.data.context.publicPath,
      filename: `${item.data.context.report}.xlsx`
    })
    this.setState(({ list }) => ({
      list: list.map(i => (i.data.created === item.data.created ? ({ ...i, read: true }) : i))
    }))
  }

  onClear = () => this.setState({ list: [] })

  render() {
    return (
      <div
        style={{
          marginLeft: 10
        }}
      >
        <NoticeIcon
          className='notice-icon'
          count={this.state.list.filter(i => !i.read).length}
          onItemClick={this.onItemClick}
          onClear={this.onClear}
        >
          <NoticeIcon.Tab
            list={this.state.list}
            title='导出 Excel 列表'
            emptyText='暂无记录'
            emptyImage='https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
          />
        </NoticeIcon>
      </div>
    )
  }
}

export default compose(
  pure,
  onlyUpdateForKeys(['user']),
  withNotice
)(Notice)
