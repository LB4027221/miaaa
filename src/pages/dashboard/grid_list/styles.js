import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    width: '100%',
    height: 'calc(100vh - 64px)',
    overflow: 'scroll'
  },
  content: {
    '& div': {
      backgroundColor: '#999'
    }
  },
  create: {
    position: 'fixed',
    top: '40%',
    right: -5,
    zIndex: 9
  }
})

export default injectSheet(styles)
