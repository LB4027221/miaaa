import React, { PureComponent } from 'react'

import withStyles from './styles'

class View extends PureComponent {
  state = {
    active: true,
    placeholder: 'block'
  }

  toggle = () => {
    const { active } = this.state

    if (active) {
      const cb = () => setTimeout(() => {
        this.setState({ placeholder: 'none' })
      }, 120)
      return this.setState({ active: !active }, cb)
    }

    return this.setState({
      active: true,
      placeholder: 'block'
    })
  }

  render() {
    const activeStyle = {
      transform: 'translateY(0)'
    }

    const styles = this.state.active
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
        <div className={this.props.classes.headerBtn} onClick={this.toggle} />
      </div>
    )
  }
}

export default withStyles(View)
