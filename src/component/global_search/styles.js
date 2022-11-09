import injectSheet from 'react-jss'

const styles = () => ({
  container: {
    borderRadius: 0,
    border: 'none',
    borderBottom: '1px solid #d9d9d9',
    '& input': {
      borderRadius: 0,
      border: 'none',
      '&:hover': {
        borderColor: '#fff !important',
        boxShadow: 'none !important'
      },
      '&:focus': {
        borderColor: '#fff !important',
        boxShadow: 'none !important'
      }
    }
  }
})

export default injectSheet(styles)
