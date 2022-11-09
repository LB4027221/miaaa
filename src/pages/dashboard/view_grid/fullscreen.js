import React, { Component } from 'react'
import { Button } from 'antd'
import { fromEvent, of } from 'rxjs'
import { map, mergeAll, throttleTime } from 'rxjs/operators'
import { tween, styler } from 'popmotion'

import withStyles from './styles'

const mousemove$ = fromEvent(document, 'mousemove')
  .pipe(throttleTime(6000))

const defaultLineStyle = {
  stroke: '#d9d9d9',
  lineWidth: 1,
  lineDash: [4, 4]
}

const darkLineStyle = {
  stroke: '#292D32',
  lineWidth: 1,
  lineDash: [2, 2]
}

class Fullscreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      icon: 'fullscreen',
      lineStyle: defaultLineStyle
    }
  }

  show = () => {
    this.mousemove$.unsubscribe()
    const el = document.querySelector('#fullscreenBtn')
    const btn = styler(el)

    btn.set({ display: 'block' })
    tween({ to: 1, duration: 500 })
      .start(opacity => btn.set({ opacity }))

    setTimeout(() => {
      this.hide()
    }, 3000)
  }

  hide = () => {
    const el = document.querySelector('#fullscreenBtn')
    const btn = styler(el)
    tween({ to: 0, duration: 1000 })
      .start({
        update: opacity => btn.set({ opacity }),
        complete: () => {
          btn.set({ display: 'none' })
          this.mousemove$ = mousemove$
            .subscribe(() => {
              this.show()
            })
        }
      })
  }

  componentDidMount() {
    const events = of(
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'fullscreenchange'
    )
    const subFullscreen$ = events.pipe(
      map(e => fromEvent(document, e)),
      mergeAll()
    )
    this.mousemove$ = mousemove$
      .subscribe(() => {
        this.show()
      })

    this.subFullscreen = subFullscreen$
      .subscribe(() => {
        const isFullScreen = document.fullscreenElement

        this.setState({
          icon: isFullScreen ? 'fullscreen-exit' : 'fullscreen',
          lineStyle: isFullScreen ? darkLineStyle : defaultLineStyle
        })
      })
  }

  componentWillUnmount() {
    this.subFullscreen.unsubscribe()
  }

  fullscreen = () => {
    const elem = document.querySelector('.fullscreen')
    if (document.fullscreenElement) {
      return document.exitFullscreen()
    } else if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    }
  }

  render() {
    return (
      <div
        id='fullscreenBtn'
        className={this.props.classes.fullscreen}
        style={{
          display: 'block',
          opacity: 1
        }}
      >
        <Button
          type='primary'
          ghost
          onClick={() => this.fullscreen()}
          icon={this.state.icon}
          shape='circle'
          size='large'
        />
      </div>
    )
  }
}

export default withStyles(Fullscreen)
