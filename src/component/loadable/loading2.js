import React from 'react'
import LoadingComp from './loading_ctx'

const Loading = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0
    }}
  >
    <LoadingComp />
  </div>
)

export default Loading
