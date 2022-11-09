import injectSheet from 'react-jss'

const styles = ({
  colors,
  unit,
  events,
  display
}) => ({
  container: {
    minHeight: '100%'
  },
  content: {
    padding: 20
  },
  tableOverflow: {
    width: '100%',
    overflow: 'scroll'
  },
  table: {
    // backgroundColor: colors.white,
    // padding: '24px 32px 80px 32px',
    color: 'rgba(0,0,0,.65)'
    // boxShadow: '0 0 2px rgba(0,21,41,.03)'
  },
  pagination: {
    margin: '16px 0px',
    float: 'right'
  },
  submitButtons: {
    whiteSpace: 'nowrap'
  },
  form: {
    marginBottom: 16 * unit
  },
  fullSubmit: {
    ...display.flexRowCenter,
    justifyContent: 'flex-end'
  },
  toggleButton: {
    marginLeft: 8 * unit,
    color: colors.blue,
    ...events.pointer
  },
  tableRow: {
    '& td': {
      maxWidth: '15vw'
    }
  },
  headerContent: {
    position: 'relative'
  },
  conf: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15
  },
  headerPlaceholder: {
    opacity: 0,
    position: 'relative',
    zIndex: -1,
    transition: 'all 80ms'
  },
  headerBody: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    transform: 'translateY(calc(-100% - 10px))',
    transition: 'all 120ms'
  },
  headerBtn: {
    cursor: 'pointer',
    margin: '10px auto 0px auto',
    transition: 'all 120ms',
    backgroundColor: '#ccc',
    height: 8,
    width: 70,
    borderRadius: 4,
    zIndex: 2
  },
  footerTab: {
    cursor: 'pointer',
    border: '1px solid #eee',
    padding: '0 6px',
    display: 'inline-block',
    height: '30px',
    lineHeight: '30px',
    borderTop: 'none',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    marginRight: 0
  }
})

export default injectSheet(styles)
