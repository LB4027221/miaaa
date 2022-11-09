import injectStyle from 'react-jss'

const styles = ({ colors, unit }) => ({
  logo: {
    backgroundColor: colors.deepblue,
    position: 'relative',
    transition: 'all 0.3s',
    overflow: 'hidden',
    height: 64 * unit,
    '& a': {
      display: 'block',
      height: '100%'
    },
    '& svg': {
      width: '100%'
    }
  },
  full: {
    marginTop: '-8px'
  }
})

export default injectStyle(styles, { inject: ['classes', 'sheet'] })
