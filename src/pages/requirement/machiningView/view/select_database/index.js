import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import R from 'ramda/src'
import PropTypes from 'prop-types'
import { setDatabase, setReport } from '../../action'
// import {
//   createFragmentContainer,
//   graphql
// } from 'react-relay'

// const RadioButton = Radio.Button
// const RadioGroup = Radio.Group
const { Option } = Select

const SelectDatabase = ({ report, database, databaseList, setDatabase }) => {
  let value = report.databaseArr
  // console.log(report)
  return (
    <Select
      mode='multiple'
      value={value}
      style={{width: 300}}
      onChange={value => {
        report.databaseArr = value
        setReport(report)
        if (value.length) setDatabase(value)
      }}
    >
      {databaseList.map(({ id, name }) => (<Option key={id} value={name}>{name}</Option>))}
    </Select>
    // <RadioGroup
    //   value={report.database}
    //   style={{marginRight: 10}}
    //   onChange={({ target: {value} }) => {
    //     setDatabase({ report: { ...report, database: value }, value })
    //   }}
    // >
    //   {databaseList.edges.map(({ node: { id, name } }) => (<RadioButton key={id} value={id}>{name}</RadioButton>))}
    // </RadioGroup>
  )
}

SelectDatabase.PropTypes = {
  report: PropTypes.object.isRequired,
  database: PropTypes.object.isRequired,
  setReport: PropTypes.func.isRequired
}

export default connect(
  ({ editedReport }) => R.pick(['report', 'database', 'databaseList'])(editedReport),
  dispatch => ({
    setDatabase: (...args) => dispatch(setDatabase(...args)),
    setReport: (...args) => dispatch(setReport(...args))
  })
)(SelectDatabase)

// export default createFragmentContainer(SelectDatabase, {
//   database: graphql`
//     fragment selectDatabase_database on Database @relay(plural: true) {
//       name
//     }
//   `
// })
