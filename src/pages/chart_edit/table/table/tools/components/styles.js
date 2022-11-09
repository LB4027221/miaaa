import injectSheet from 'react-jss'

const styles = ({
  display
}) => ({
  formItem: {
    ...display.flexRowCenter,
    justifyContent: 'flex-start',
    paddingRight: 10,
    position: 'relative',
    marginBottom: 20,
    '& label': {
      position: 'absolute',
      top: -14,
      left: 0,
      fontSize: 12,
      height: 20,
      width: 'auto',
      textAlign: 'left',
      transform: 'scale(0.8)'
    }
  }
})

export default injectSheet(styles)
