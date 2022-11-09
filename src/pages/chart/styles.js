import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    width: '100%'
  },
  content: {
    width: '100%',
    padding: '0',
    postion: 'relative',
    flex: 1,
    '& .ant-tabs-bar': {
      margin: 0
    }
  },
  timelineCtx: {
    // margin: 20
  },
  tableCtx: {
    width: '100%',
    // paddingRight: 15,
    // margin: 20,
    // marginTop: 50,
    '& .ant-card-body': {
      padding: 0
    }
  },
  pane: {
    width: '100%',
    height: 'calc(100vh - 163px)'
  }
})

export default injectSheet(styles)
