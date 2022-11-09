import injectSheet from 'react-jss'

const card = {
  marginBottom: 20,
  '&:hover': {
    cursor: 'pointer'
  },
  '& .ant-card-bordered': {
    border: '1px solid #e8e8e8 !important'
  }
}

const styles = () => ({
  container: {
    width: '100%',
    height: 'calc(100vh - 64px)',
    overflow: 'scroll',
    position: 'relative',
    '&:fullscreen': {
      paddingTop: 15
    },
    '& .antd-pro-charts--chart-card-action': {
      '&:fullscreen': {
        display: 'none'
      }
    }
  },
  drawer: {
    position: 'fixed',
    top: '40%',
    right: -5,
    zIndex: 9,
    '& button': {
      borderRadius: '4px 0 0 4px'
    }
  },
  content: {
    minHeight: '100%',
    '& div': {
      // backgroundColor: '#999'
    }
  },
  card,
  isActive: {
    ...card,
    '& .ant-card-bordered': {
      border: '1px solid #1890ff !important'
    }
  },
  fullscreen: {
    position: 'fixed',
    bottom: 50,
    right: 40,
    zIndex: 99
  }
})

export default injectSheet(styles)
