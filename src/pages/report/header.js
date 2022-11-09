import React, { PureComponent } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import withStyles from './styles'

class View extends PureComponent {
  state = {
    placeholder: 'block'
  }

  toggle = () => {
    const { active } = this.props

    if (active) {
      return this.setState({ placeholder: 'none' }, () => this.props.toggle(!active))
    }

    return this.setState({
      placeholder: 'block'
    }, () => this.props.toggle(!active))
  }

  render() {
    const activeStyle = {
      transform: 'translateY(0)'
    }

    const styles = this.props.active
      ? activeStyle
      : {}

    return (
      <div className={this.props.classes.headerContent}>
        <div
          className={this.props.classes.headerPlaceholder}
          style={{
            display: this.state.placeholder
          }}
        >
          {this.props.children}
        </div>
        <div className={this.props.classes.headerBody} style={styles}>
          {this.props.children}
        </div>
        <div className={this.props.classes.headerBtn} onClick={this.toggle}>
          <div className={this.props.classes.arr}>{'<-'}点我{this.state.placeholder === 'block' ? '收起' : '展开'}</div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({ active: state.header })
const mapDispatch = dispatch => ({ toggle: dispatch.header.onChange })

export default compose(
  withStyles,
  connect(mapState, mapDispatch)
)(View)
