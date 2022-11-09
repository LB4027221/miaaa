import injectSheet from 'react-jss'

const styles = ({
  colors,
  unit,
  events,
  display
}) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#999',
    overflow: 'scroll'
  }
})

export default injectSheet(styles)
