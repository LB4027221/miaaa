import injectSheet from 'react-jss'
import { isMobile } from 'react-device-detect'

const styles = ({
  colors,
  unit,
  events,
  display
}) => ({
  container: {},
  content: {
    padding: 20,
    width: '100%',
    overflow: 'scroll',
    height: 'calc(100vh - 118px)'
  },
  body: {
    ...display.flexRowCenter,
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  groups: {
    width: isMobile ? '100%' : 'calc(33.33% - 16px)',
    marginLeft: isMobile ? 0 : 16
  },
  table: {
    backgroundColor: colors.white,
    padding: '24px 32px 80px 32px',
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
  reports: {
    width: isMobile ? '100%' : '66.66%'
  },
  cards: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridColumnGap: '20px',
    gridRowGap: '20px'
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'flex-start'
  },
  stacks: {
    height: '100%',
    marginTop: 15,
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: '20px',
    gridRowGap: '20px'
  },
  defaultCharts: {
    marginTop: 15,
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: '20px',
    gridRowGap: '20px'
  },
  timelines: {
    marginTop: 15,
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '100%',
    gridColumnGap: '20px',
    gridRowGap: '20px'
  },
  area: {
    marginTop: 15,
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '100%',
    gridColumnGap: '20px',
    gridRowGap: '20px'
  },
  tableRow: {
    '& td': {
      maxWidth: '15vw'
    }
  },
  roles: {
    marginTop: 0
  },
  groupsCard: {
    marginBottom: 16,
    '& ul': {
      display: 'none'
    },
    '& .ant-list-item:hover': {
      '& ul': {
        display: 'block'
      }
    }
  }
})

export default injectSheet(styles)
