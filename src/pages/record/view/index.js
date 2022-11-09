import React, { Fragment, PureComponent } from 'react'
import { renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
import withErrorHandler from '@component/error'
import withStyle from './styles'


const { Content } = Layout

class View extends PureComponent {
  render() {
    const { route } = this.props

    return (
      <Content >
        <Fragment>
          <Content className={this.props.classes.content}>
            {renderRoutes(route.routes)}
          </Content>
        </Fragment>
      </Content>
    )
  }
}

export default withErrorHandler(withStyle(View))
