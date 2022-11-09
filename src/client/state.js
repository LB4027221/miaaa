// import typeDefs from './type'

// const defaults = {
//   reportPage: {
//     __typename: 'ReportPage',
//     pageSize: 15,
//     current: 1,
//     components: []
//   }
// }

// const resolvers = {
//   Query: {
//     reportPage: (obj, args, context, info) => {
//       console.log('====================================')
//       console.log(obj, args, context)
//       console.log('====================================')
//       return {
//         __typename: 'ReportPage',
//         pageSize: 16,
//         current: 1,
//         id: args.id,
//         components: []
//       }
//     }
//   },
//   Mutation: {
//     onChangePage: (_, { current, id }, { cache, getCacheKey }) => {
//       const _id = getCacheKey({ __typename: 'ReportPage', id })
//       console.log('====================================')
//       console.log('cache', cache, _id)
//       console.log('====================================')
//       const data = {
//         reportPage: {
//           __typename: 'ReportPage',
//           pageSize: 15,
//           current: 1
//         }
//       }
//       cache.writeData({ data })

//       return null
//     }
//   }
// }

// export default {
//   defaults,
//   resolvers,
//   typeDefs
// }
