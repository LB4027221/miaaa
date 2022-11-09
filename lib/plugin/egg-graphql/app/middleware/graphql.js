'use strict'

const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const koaPlayground = require('graphql-playground-middleware-koa').default
const { processRequest } = require('graphql-upload')
const { ApolloServer, gql } = require('apollo-server')

module.exports = (_, app) => {
  const options = app.config.graphql
  const graphQLRouter = options.router
  let graphiql = true

  if (options.graphiql === false) {
    graphiql = false
  }

  return async (ctx, next) => {
    /* istanbul ignore else */
    if (ctx.path === graphQLRouter) {
      // if (ctx.request.accepts(['json', 'html']) === 'html' && graphiql) {
      //   if (options.onPreGraphiQL) {
      //     await options.onPreGraphiQL(ctx)
      //   }
      //   return koaPlayground({
      //     endpoint: graphQLRouter,
      //     subscriptionEndpoint: 'ws://local.songxiaocai.org:1024/subscriptions'
      //   })(ctx, next)
      // }
      // if (options.onPreGraphQL) {
      //   await options.onPreGraphQL(ctx)
      // }
      // https://github.com/jaydenseric/graphql-multipart-request-spec
      // if (ctx.request.is('multipart/form-data')) {
      //   ctx.request.body = await processRequest(ctx.req, ctx.res, options)
      // }

      // return graphqlKoa({
      //   schema: app.schema,
      //   tracing: true,
      //   cacheControl: {
      //     defaultMaxAge: 5
      //   },
      //   debug: process.env.NODE_ENV !== 'production',
      //   context: ctx,
      //   formatError: (err) => {
      //     ctx.logger.error(err)
      //     return err
      //   }
      // })(ctx)
    }
    await next()
  }
}
