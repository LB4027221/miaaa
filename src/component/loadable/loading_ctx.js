import React, { Component } from 'react'
import { value, styler, tween, easing, delay, chain, spring } from 'popmotion'
import Loading from './loading_svg'

const outline = 24
const inline = 13

const mapId = (key, max, res = [], i = 1) => {
  if (i > max) {
    return res
  }
  return mapId(key, max, [...res, `#${key}${i}`], i + 1)
}

const outlineArr = mapId('y', outline)
const inlineArr = mapId('x', inline)

const scaleIn = (comp, defaultDelay = 0) => (id, idx) => {
  const pathStyler = styler(comp.querySelector(id))
  const pathScale = value({ scale: 0 }, pathStyler.set)

  chain(
    delay(50 * idx + defaultDelay),
    spring({
      from: { scale: 0 },
      to: { scale: 1 },
      ease: {
        scale: easing.backOut
      },
      velocity: pathScale.getVelocity(),
      stiffness: 200,
      duration: 800
    })
  ).start(v => pathStyler.set(v))
}

const scaleOut = (comp, defaultDelay = 0, max) => (id, idx) => {
  const pathStyler = styler(comp.querySelector(id))

  chain(
    delay(50 * Math.abs(max - idx) + defaultDelay),
    spring({
      from: { scale: 1 },
      to: { scale: 0 },
      ease: {
        scale: easing.backOut
      },
      duration: 800
    })
  ).start(v => pathStyler.set(v))
}

const rotateIn = (comp) => {
  const pathStyler = styler(comp.querySelector('#sxc_comp'))
  tween({
    from: { rotate: 0, scale: 0.1 },
    to: { rotate: 720, scale: 1 },
    ease: easing.easeOut,
    duration: 2000
  }).start(v => pathStyler.set(v))
}

const rotateOut = (comp) => {
  const pathStyler = styler(comp.querySelector('#sxc_comp'))
  tween({
    from: { rotate: 0, scale: 1 },
    to: { rotate: 720, scale: 0.1 },
    ease: easing.easeIn,
    duration: 2400
  }).start(v => pathStyler.set(v))
}


class App extends Component {
  componentDidMount() {
    const comp = document.querySelector('#sxc-loading')
    if (comp) {
      const animation = () => {
        rotateIn(comp)
        outlineArr.forEach(scaleIn(comp, 0, 0)) 
        inlineArr.forEach(scaleIn(comp, 1000, 0)) 

        this.timer = setTimeout(() => {
          outlineArr.forEach(scaleOut(comp, 700, outlineArr.length)) 
          inlineArr.forEach(scaleOut(comp, 0, inlineArr.length)) 
          rotateOut(comp)
        }, 2200)
      }

      animation()
      this.loop = setInterval(animation, 4600)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    clearInterval(this.loop)
  }

  render() {
    return (
      <Loading width={this.props.width} height={this.props.height} />
    )
  }
}

export default App
