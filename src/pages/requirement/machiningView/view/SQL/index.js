import React, { Fragment } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import docco from 'react-syntax-highlighter/dist/styles/lowlight/docco'
import R from 'ramda/src'
import { connect } from 'react-redux'

const { parser, parserCountSQL } = require('../../../../../../lib/ast/parser')

const beautify = (sqlStr) => {
  sqlStr = sqlStr.replace(/select/, 'SELECT\n')
  sqlStr = sqlStr.replace(/as\s`[\u4e00-\u9fa5]{0,20}`,/g, match => `${match}\n`)
  sqlStr = sqlStr.replace(/(from|where|group by|limit|inner join|left join|right join|order by|having)/g, ch => `\n${ch.toUpperCase()}`)
  sqlStr = sqlStr.replace(/and/g, '\n  and')

  return sqlStr
}

const SQL = (props) => {
  let sqlStr = ''
  let countSqlStr = ''
  let {
    metaList,
    report,
    where,
    joins,
    groupBy,
    targets,
    orderBy,
    having
  } = props

  report.having = having

  sqlStr = parser({
    metaList,
    report,
    where,
    joins,
    groupBy,
    targets,
    orderBy
  })

  // countSqlStr = parserCountSQL({
  //   metaList,
  //   report,
  //   where,
  //   joins,
  //   groupBy,
  //   targets,
  //   orderBy
  // })

  // console.log('====================================')
  // console.log(beautify(countSqlStr))
  // console.log('====================================')

  // console.log(countSql(metaList, report, components, joins))
  return (
    <Fragment>
      <SyntaxHighlighter language='sql' style={docco}>{beautify(sqlStr)}</SyntaxHighlighter>
      {/* <br />
      <SyntaxHighlighter language='sql' style={docco}>{beautify(countSqlStr)}</SyntaxHighlighter> */}
    </Fragment>
  )
}

export default connect(state => ({
  metaList: state.metaList,
  report: state.editReport,
  where: state.where,
  joins: state.join,
  groupBy: state.groupBy,
  targets: state.targets,
  having: state.having,
  orderBy: state.orderBy
}))(SQL)

