import { withContext } from 'recompose'
import PropTypes from 'prop-types'
// import React, { PureComponent, createContext } from 'react'
// import { Form } from 'antd'

// const Context = createContext()

// class Provider extends PureComponent {
//   state = {
//     meta: [],
//     base: {}
//   }
//   render() {
//     return (
//       <Context.Provider
//         value={{
//           base: this.state.base,
//           meta: this.state.meta,
//           form: this.props.form
//         }}
//       >
//         {this.props.children}
//       </Context.Provider>
//     )
//   }
// }

// export default Form.create()(Provider)
// export const { Consumer } = Context
// import React from 'react'

const provide = store => withContext(
  { store: PropTypes.object },
  () => ({ store })
)

export default provide

