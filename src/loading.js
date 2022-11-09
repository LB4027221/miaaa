import React from 'react'
import { Row } from 'antd'
import Loading from '@component/loadable/loading'
import { isMobile } from 'react-device-detect'

const View = () => (
  <div
    className='loading-page'
    style={{
      width: '100vw',
      height: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      flexDirection: 'row',
      zIndex: 0,
      position: 'absolute'
    }}
  >
    {!isMobile && (
      <div
        style={{
          width: localStorage.getItem('miaaa_sider') ? '80px' : '256px',
          height: '100vh',
          background: '#001529',
          boxShadow: '2px 0 6px rgba(0,21,41,.35)',
          position: 'relative',
          zIndex: 2
        }}
      />
    )}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: 64,
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        zIndex: 1
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: isMobile
          ? 0
          : localStorage.getItem('miaaa_sider') ? '80px' : '256px',
        width: isMobile
          ? '100vw'
          : `calc(100vw - ${localStorage.getItem('miaaa_sider') ? '80px' : '256px'})`,
        height: 'calc(100vh - 64px)',
        background: '#f0f2f5',
        padding: 20
      }}
    >
      <br />
      <Row gutter={16}>
        <Loading />
      </Row>
      <br />
    </div>
  </div>
)

export default View
