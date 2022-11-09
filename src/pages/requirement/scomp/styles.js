import injectSheet from 'react-jss'

const styles = ({ colors, unit, display }) => ({
  container: {
    width: '100%',
    height: '100%',
    ...display.flexRowCenter
  },
  context: {
    flex: 1,
    height: 500 * unit,
    ...display.flexColumnCenter,
    marginLeft: -200 * unit,
    marginTop: -100 * unit
  },
  title: {
    ...display.flexRowCenter,
    width: '100%',
    height: 100,
    '& title': {
      display: 'block',
      fontSize: 100 * unit,
      color: colors.deepblue
    }
  },
  animation: {
    width: 90 * unit,
    height: 90 * unit,
    marginLeft: -10 * unit,
    marginRight: -10 * unit
  },
  footer: {
    ...display.flexColumnCenter,
    marginTop: 20 * unit
  },
  description: {
    fontSize: 16 * unit,
    color: '#666',
    marginBottom: 20 * unit
  },
  btn: {
    ...display.flexRowCenter,
    width: 120 * unit,
    height: 40 * unit,
    borderRadius: 20 * unit,
    color: colors.white,
    backgroundColor: colors.blue
  }
})

export default injectSheet(styles)
