const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
// const { GraphQLUpload } = require('graphql-upload')

function anyValue(value) {
  return value
}

module.exports = {
  // Upload: GraphQLUpload,
  Any: new GraphQLScalarType({
    name: 'Any',
    description: '任意类型数据',
    parseValue: anyValue,
    serialize: anyValue,
    parseLiteral(ast) {
      return ast.value
    }
  }),
  Date: new GraphQLScalarType({
    name: 'Date',
    description: '日期类型',
    parseValue(value) {
      return new Date(value)
    },
    serialize(value) {
      return value.getTime()
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    }
  })
}
