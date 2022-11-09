import React from 'react'
// import { gql } from 'apollo-boost'
// import { Query } from 'react-apollo'
import MonacoEditor from 'react-monaco-editor'
import ReactJson from 'react-json-view'
import { toSQL, toJSON } from '@lib/ast'

const requireConfig = {
  url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  paths: {
    vs: 'https://cdn.bootcss.com/monaco-editor/0.12.0/min/vs'
  }
}

const editorDidMount = (editor, monaco) => {
  console.log('editorDidMount', editor)
  editor.focus()
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: 'select date_add(curdate(), interval 1 day)',
      ast: {},
      sql: ''
    }
  }
  onChange = (code, e) => {
    const ast = toJSON.parse(code)
    const sql = toSQL(ast)

    this.setState({ ast, code, sql })
  }
  render() {
    const { code, sql } = this.state
    const options = {
      selectOnLineNumbers: true
    }
    return (
      <div style={{ display: 'flex' }}>
        <div>
          <MonacoEditor
            width='800'
            height='500'
            requireConfig={requireConfig}
            language='mysql'
            theme='vs-dark'
            value={code}
            options={options}
            onChange={this.onChange}
            editorDidMount={editorDidMount}
          />
          <pre>
            <code>
              {sql}
            </code>
          </pre>
        </div>
        <ReactJson
          src={this.state.ast}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      </div>
    )
  }
}

export default App
