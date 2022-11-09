import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'

// const View = (props) => {
//   console.log(props)
//   console.log('sjfisojdfoisjdfio888')
//   props.dispatch.editReport.initEditedReportAsync('59b13cd28a574bb0bacfd915')
//   return (
//      <Fragment>
//             hahaha
//         </Fragment>
//   )
// }

class View extends Component {
  async componentDidMount() {
    await this.props.dispatch.editReport.initEditedReportAsync('59b13cd28a574bb0bacfd915')
    let report = this.props.report
    const { targets } = report
    if (targets.length) {
      this.props.dispatch.treeData.setTreeDataSync(report.targets)
      this.props.dispatch.targets.setTargets(report.targets)
    }
  }

  render() {
    return (
      <Fragment>
      hahahah12112
    </Fragment>
    )
  }
}

const mapState = state => ({
  report: state.editReport,
  treeData: state.treeData,
  targets: state.targets
})

export default connect(mapState)(View)
