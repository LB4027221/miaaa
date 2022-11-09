const typeDefs = [`
  schema {
    query: RootQuery
  }

  type RootQuery {
    reportPage(id: ID!, current: Int!, jumpTo: Int) {
      pageSize
      current
      components
    }
  }
`]

export default typeDefs
