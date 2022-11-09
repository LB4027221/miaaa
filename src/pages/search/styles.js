import injectSheet from 'react-jss'

const styles = ({ colors }) => ({
  container: {
    overflow: 'scroll',
    height: 'calc(100vh - 64px)'
  },
  content: {
    padding: 20
  },
  results: {
    padding: '20px 30px 50px 30px',
    backgroundColor: colors.white
  }
})

export default injectSheet(styles)
