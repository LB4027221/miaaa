import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    padding: 20,
    overflow: 'scroll',
    height: 'calc(100vh - 118px)'
  }
})

export default injectSheet(styles)
