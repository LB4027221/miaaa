import React, { PureComponent } from 'react'
import { withUser, withUserReports } from '@gql'
import { findBy, initReport, with404 } from '@lib'
import { compose, withProps } from 'recompose'
import withTitle from '@component/title'

// import ReactDataSheet from 'react-datasheet'
// Be sure to include styles at some point, probably during your bootstrapping
// import 'react-datasheet/lib/react-datasheet.css'

import Excel from './excel'
import store from '../report/store'
import withStyle from './styles'

const findById = findBy('_id')
const ChartEdit = (props) => {
  const { report, classes } = props
  try {
    const reducer = initReport(report)
    store.model(reducer)
    store.dispatch({ type: '@@RESET' })
    store.dispatch({
      type: 'id/onChange',
      payload: props.match.params.id
    })
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <div className={classes.table}>
          <Excel />
        </div>
      </div>
    )
  } catch (e) {
    return (
      <div>
        <h1>这张表有点问题，可以问下旺张</h1>
      </div>
    )
  }
}

// class ChartEdit extends PureComponent {
//   constructor(props) {
//     super(props)
//     this.data = [
//       ['Year', 'Ford', 'Volvo', 'Toyota', 'Honda'],
//       ['2016', 10, 11, 12, 13],
//       ['2017', 20, 11, 14, 13],
//       ['2018', 30, 15, 12, 13]
//     ]
//   }

//   render() {
//     return (
//       <div id='hot-app'>
//         <HotTable
//           data={this.data}
//           settings={{ ...conf }}
//         />
//       </div>
//     )
//   }
// }

const withReport = withProps(props => ({
  report: props.match.params.id
    ? findById(props.match.params.id, props.userReports.user.reports)
    : ''
}))

export default compose(
  withStyle,
  withUser,
  withReport,
  withUserReports,
  with404(props => !props.report),
  withTitle(props => (props.report ? props.report.cname : ''))
)(ChartEdit)

