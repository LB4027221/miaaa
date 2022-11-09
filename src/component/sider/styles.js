import injectStyle from 'react-jss'

const styles = ({ colors, unit }) => ({
  sider: {
    width: 256 * unit,
    height: '100vh',
    overflow: 'scroll',
    boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
    position: 'relative',
    zIndex: 10,
    '&::-webkit-scrollbar': {
      width: '0px'
    },
    '& .light': {
      backgroundColor: colors.white,
      h1: {
        color: '#002140'
      }
    }
  }
})

export default injectStyle(styles)
