import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    right: 0,
    height: '50px',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.03)',
    background: '#fff',
    borderTop: '1px solid #eee',
    paddingLeft: '256px',
    zIndex: 9
  }
})

export default injectSheet(styles)
