import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    padding: 20
  },
  card: {
    marginTop: 15
  },
  description: {
    minHeight: 150
  }
})

export default injectSheet(styles)
