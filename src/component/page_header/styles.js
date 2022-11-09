import injectSheet from 'react-jss'

const styles = ({ display, colors }) => ({
  container: {
    background: colors.white,
    padding: '16px 32px',
    borderBottom: '1px solid #e8e8e8'
  },
  icon: {
    color: '#1890ff',
    marginLeft: 10,
    fontSize: 12,
    cursor: 'pointer'
  },
  img: {
    width: 190
  },
  title: {
    position: 'relative',
    '& h2': {
      marginBottom: 10,
      marginTop: 16
    }
  },
  workPlaceHeader: {
    ...display.flexRowCenter,
    justifyContent: 'flex-start'
  },
  pageHeaderContent: {
    ...display.flexRowCenter,
    justifyContent: 'flex-start',
    flex: 1
  },
  titleContent: {
    ...display.flexColumnCenter,
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 24
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: 'rgba(0,0,0,.85)'
  },
  userPosition: {
    fontSize: 13,
    color: 'rgba(0,0,0,.45)'
  },
  extraContent: {
    minWidth: 'calc(33.33% - 20px)',
    ...display.flexColumnCenter,
    alignItems: 'flex-start'
  },
  tools: {
    ...display.flexRowCenter,
    justifyContent: 'flex-start'
  },
  p: {
    fontSize: 28,
    color: 'rgba(0,0,0,.85)'
  }
})

export default injectSheet(styles)
