import injectSheet from 'react-jss'

const styles = ({ display, colors, unit }) => ({
  container: {
    ...display.flexRowCenter,
    justifyContent: 'space-between',
    background: colors.white,
    padding: 0,
    boxShadow: '0 1px 4px rgba(0,21,41,.08)',
    position: 'relative',
    zIndex: 2
  },
  trigger: {
    fontSize: 20 * unit,
    height: 64 * unit,
    width: 64 * unit,
    cursor: 'pointer',
    transition: 'all 0.2s, padding 0s',
    padding: '0 24px',
    '&:hover': {
      background: colors.blue3
    }
  },
  rightTools: {
    ...display.flexRowCenter
  },
  account: {
    padding: '0 20px',
    '&:hover': {
      background: colors.blue3
    }
  },
  avatar: {
    margin: '20px 8px 20px 0',
    backgroundColor: 'hsla(0,0%,100%,.85)'
  },
  userName: {
    fontSize: 13,
    color: 'rgba(0,0,0,.65)'
  },
  menu: {
    width: 160,
    '& i': {
      marginRight: 10
    }
  }
})

export default injectSheet(styles)
