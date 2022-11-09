import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    position: 'fixed',
    fixDirection: 'row',
    backgroundColor: '#f0f0f0',
    width: '100%',
    bottom: 0,
    right: 0,
    height: '40px',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.03)',
    paddingLeft: '256px',
    zIndex: 9,
    display: 'flex',
    justifyContent: 'space-between'
  },
  left: {
    flex: 1,
    overflow: 'scroll',
    flexDirection: 'row',
    height: 40
  }
})

export default injectSheet(styles)
