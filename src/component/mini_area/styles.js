import injectStyle from 'react-jss'

const styles = () => ({
  miniChart: {
    position: 'relative',
    width: '100%',
    '& .chartContent': {
      position: 'absolute',
      bottom: '-28px',
      width: '100%',
      '& > div': {
        margin: '0 -5px',
        overflow: 'hidden'
      }
    },
    '& .chartLoading': {
      position: 'absolute',
      top: '16px',
      left: '50%',
      marginLeft: '-7px'
    }
  }
})

export default injectStyle(styles, { inject: ['classes', 'sheet'] })
