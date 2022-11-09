import injectStyle from 'react-jss'

const styles = ({ colors, unit }) => ({
  layout: {
    minHeight: '100vh'
  },
  content: {
    margin: '24px 16px',
    padding: 24,
    background: '#fff',
    minHeight: 280
  },
  sider: {
    width: 256 * unit,
    minHeight: '100vh',
    boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
    position: 'relative',
    zIndex: 10,
    '& .light': {
      backgroundColor: colors.white,
      h1: {
        color: '#002140'
      }
    }
  }
})

export default injectStyle(styles)
