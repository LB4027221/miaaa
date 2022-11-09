import injectSheet from 'react-jss'
import { isMobile } from 'react-device-detect'

const styles = ({
  colors,
  unit,
  events,
  display
}) => ({
  container: {
    height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 108px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll'
  },
  content: {
    padding: isMobile ? 0 : '10px 20px 0 20px',
    flex: 1
  },
  tableCtx: {
    // width: '100%',
    // height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  loadingSket: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 250px)',
    columnGap: '20px',
    '& .ant-skeleton-title': {
      width: '100% !important'
    }
  },
  tableOverflow: {
    // width: '100%'
    minHeight: 200,
    // flex: 1,
    // width: '100%',
    overflow: 'scroll',
    '& .ant-spin': {
      position: 'absolute',
      top: 100,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9
    },
    '& .ant-empty-image': {
      position: 'absolute',
      top: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 8
    }
  },
  table: {
    // width: '100%',
    // height: '100%',
    backgroundColor: colors.white,
    padding: '14px 16px 0 16px',
    color: 'rgba(0,0,0,.65)',
    boxShadow: '0 0 2px rgba(0,21,41,.03)'
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
  },
  arr: {
    position: 'absolute',
    left: 'calc(100% + 10px)',
    top: -5,
    width: 100,
    fontSize: 10
  }
})

export default injectSheet(styles)
