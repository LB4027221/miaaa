import React, { createFactory, Component, Fragment } from 'react'
import tween from 'popmotion/animations/tween'

const translation = (config, test, Left) => (Right) => {
  const entryAnimation = tween({
    from: 0,
    to: 1
  })
  const leaveAnimation = tween({
    from: 1,
    to: 0,
    ...config
  })
  const left = createFactory(Left)
  const right = createFactory(Right)

  class WithTranslation extends Component {
    constructor(props) {
      super(props)

      this.state = {
        leave: config.from,
        entry: config.to,
        factory: {
          left
        }
      }
    }

    componentWillReceiveProps(nextProps) {
      if (test(nextProps) && this.state.factory.left) {
        const a = () => {
          leaveAnimation.start({
            update: (opacity) => {
              const leave = { opacity }
              const entry = { opacity: 1 - opacity }
              this.setState({ leave, entry })
            },
            complete: () => {
              this.setState({ factory: { right } })
            }
          })
        }

        this.setState({ factory: { left, right } }, a)
      }
    }

    render() {
      return (
        <Fragment>
          {this.state.factory.left && this.state.factory.left({
            ...this.props,
            key: 'left',
            styles: this.state.leave
          })}
          {this.state.factory.right && this.state.factory.right({
            ...this.props,
            key: 'right',
            styles: this.state.entry
          })}
        </Fragment>
      )
    }
  }

  return WithTranslation
}

export default translation
