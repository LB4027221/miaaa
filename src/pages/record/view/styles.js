import injectSheet from 'react-jss'

const styles = () => ({
  content: {
    padding: 20,
    width: '100%',
    overflow: 'scroll',
    height: 'calc(100vh - 64px)'
  }
})

export default injectSheet(styles)
