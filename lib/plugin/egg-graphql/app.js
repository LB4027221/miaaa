const { ApolloServer, gql } = require('apollo-server-koa')
const { makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const pubsub = require('./pubsub')
const loadSchema = require('./lib/load_schema')
const loadConnector = require('./lib/load_connector')

module.exports = (app) => {
  loadConnector(app)
  const { schemas, resolvers } = loadSchema(app)
  app.pubsub = pubsub

  const apolloServer = new ApolloServer({
    typeDefs: gql(schemas.join('\n')),
    resolvers,
    introspection: true,
    tracing: true,
    subscriptions: {
      onConnect: () => app.createAnonymousContext()
    },
    // subscriptionsPath: '/subscriptions',
    // subscriptionEndpoint: '/subscriptions',
    context: ({ ctx, connection }) => {
      return connection
        ? connection.context
        : ctx
    },
    uploads: {
      maxFileSize: 10000000,
      maxFiles: 20
    }
  })

  apolloServer.applyMiddleware({ app })

  app.on('server', (server) => {
    apolloServer.installSubscriptionHandlers(server)
    // SubscriptionServer.create({
    //   schema: makeExecutableSchema({
    //     typeDefs: schemas,
    //     resolvers
    //   }),
    //   execute,
    //   subscribe,
    //   onConnect: () => app.createAnonymousContext()
    // }, {
    //   server,
    //   path: '/subscriptions'
    // })
  })
}
