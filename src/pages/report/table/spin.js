import React from 'react'
import Lottie from 'react-lottie'
import animationData from './spin.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

const Spin = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      minHeight: 200,
      backgroundColor: 'rgba(0,0,0,0.05)',
      zIndex: 999
    }}
  >
    <div style={{ marginTop: 50 }}>
      <Lottie width={150} options={defaultOptions} />
    </div>
  </div>
)

export default Spin
