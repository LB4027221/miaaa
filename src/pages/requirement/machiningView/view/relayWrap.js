// import React, { Component } from 'react'
// import {
//   graphql,
//   QueryRenderer
// } from 'react-relay'
// import environment from '@/env'
// import MySql from './index'

// class View extends Component {
//   state = {}
//   render () {
//     return (
//       <QueryRenderer
//         environment={environment}
//         query={graphql`
//         `}
//         variables={{
//         }}
//         render={({error, props}) => {
//           if (error) {
//             return <div>{error.message}</div>
//           } else if (props) {
//             let routes = {
//               history: this.props.history,
//               location: this.props.location,
//               match: this.props.match
//             }
//             return <MySql {...props} {...routes} />
//           }
//           return <div>Loading</div>
//         }}
//       />
//     )
//   }
// }

// export default View
