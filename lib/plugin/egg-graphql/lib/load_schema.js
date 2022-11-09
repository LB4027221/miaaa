const fs = require('fs')
const path = require('path')
const {
  makeExecutableSchema
} = require('graphql-tools')
const _ = require('lodash')
const { gql } = require('apollo-server')
// const enableGraphQLCache = require('./cache')

const SYMBOL_SCHEMA = Symbol('Applicaton#schema')

module.exports = (app) => {
  const basePath = path.join(app.baseDir, 'app/graphql')
  const types = fs.readdirSync(basePath)

  const schemas = []
  let resolverMap = {}
  const directiveMap = {}

  types.forEach((type) => {
    // 加载schema
    const schemaFile = path.join(basePath, type, 'schema.graphql')
    /* istanbul ignore else */
    if (fs.existsSync(schemaFile)) {
      const schema = fs.readFileSync(schemaFile, {
        encoding: 'utf8'
      })
      schemas.push(schema)
    }

    // 加载resolver
    const resolverFile = path.join(basePath, type, 'resolver.js')
    if (fs.existsSync(resolverFile)) {
      const resolver = require(resolverFile) /* eslint-disable-line */
      resolverMap = _.merge(resolverMap, resolver)
    }

    // 加载directive resolver
    const directiveFile = path.join(basePath, type, 'directive.js')
    if (fs.existsSync(directiveFile)) {
      const directive = require(directiveFile) /* eslint-disable-line */
      _.merge(directiveMap, directive)
    }
  })

  return {
    schemas,
    resolvers: resolverMap
  }

  // Object.defineProperty(app, 'schema', {
  //   get() {
  //     if (!this[SYMBOL_SCHEMA]) {
  //       // const schema = makeExecutableSchema({
  //       //   typeDefs: schemas,
  //       //   resolvers: resolverMap,
  //       //   // resolverValidationOptions: {
  //       //   //   requireResolversForResolveType: false
  //       //   // },
  //       //   // directiveResolvers: directiveMap
  //       // })

  //       // enableGraphQLCache(schema)

  //       this[SYMBOL_SCHEMA] = {
  //         typeDefs: gql(schemas),
  //         resolvers: resolverMap
  //       }
  //     }
  //     return this[SYMBOL_SCHEMA]
  //   }
  // })
}
