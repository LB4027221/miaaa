import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    padding: 20
  },
  tools: {
    marginBottom: 20
  },
  headerInfo: {
    position: 'relative',
    textAlign: 'center',
    '& span': {
      color: 'rgba(255, 255, 255, .45)',
      display: 'inline-block',
      fontSize: '14px',
      lineHeight: '22px',
      marginBottom: '4px'
    },
    '& p': {
      color: 'rgba(255, 255, 255, .85)',
      fontSize: '24px',
      lineHeight: '32px',
      margin: 0
    },
    '& em': {
      backgroundColor: 'hsv(0, 0, 91%)',
      position: 'absolute',
      height: '56px',
      width: '1px',
      top: 0,
      right: 0
    }
  }
})

export default injectSheet(styles)
