const {
  GraphQLObjectType,
  getNamedType,
  defaultFieldResolver,
  // GraphQLID,
  // responsePathAsArray,
  isScalarType,
  GraphQLInterfaceType
} = require('graphql')
const graphqlFields = require('graphql-fields')


// const { CacheControlExtension } = require('apollo-cache-control')

const R = require('ramda')
const hash = require('object-hash')
const MD5 = require('md5')


const forEachField = (schema, fn) => {
  const typeMap = schema.getTypeMap()
  Object.keys(typeMap).forEach((typeName) => {
    const type = typeMap[typeName]
    if (!getNamedType(type).name.startsWith('__') && type instanceof GraphQLObjectType) {
      const fields = type.getFields()
      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName]
        fn(field, typeName, fieldName)
      })
    }
  })
}

const whenResultIsFinished = (result, callback) => {
  if (result === null || typeof result === 'undefined') {
    callback()
  } else if (typeof result.then === 'function') {
    result.then(callback, callback)
  } else if (Array.isArray(result)) {
    const promises = []
    result.forEach((value) => {
      if (value && typeof value.then === 'function') {
        promises.push(value)
      }
    })
    if (promises.length > 0) {
      Promise.all(promises).then(callback, callback)
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const getOpType = info => info.operation.operation

const isQueryOp = info => R.toLower(getOpType(info)) === 'query'

function mergeHints (hint, otherHint) {
  if (!otherHint) return hint

  return {
    maxAge: otherHint.maxAge || hint.maxAge
  }
}


function cacheHintFromDirectives (directives) {
  if (!directives) return undefined

  const cacheControlDirective = directives.find(directive => directive.name.value === 'cacheControl')
  if (!cacheControlDirective) return undefined

  if (!cacheControlDirective.arguments) return undefined

  const maxAgeArgument = cacheControlDirective.arguments.find(argument => argument.name.value === 'maxAge')

  return {
    maxAge:
      maxAgeArgument && maxAgeArgument.value && maxAgeArgument.value.kind === 'IntValue'
        ? parseInt(maxAgeArgument.value.value, 10)
        : undefined
  }
}

const getExpire = (info) => {
  let hint = {}
  const targetType = getNamedType(info.returnType)
  if (targetType instanceof GraphQLObjectType
    || targetType instanceof GraphQLInterfaceType) {
    if (targetType.astNode) {
      hint = mergeHints(hint, cacheHintFromDirectives(targetType.astNode.directives))
    }
  }
  const { parentType } = info
  if (parentType instanceof GraphQLObjectType) {
    const fieldDef = parentType.getFields()[info.fieldName]
    if (fieldDef.astNode) {
      hint = mergeHints(hint, cacheHintFromDirectives(fieldDef.astNode.directives))
    }
  }

  return hint
}

const wrapField = (field) => {
  const fieldResolver = field.resolve

  field.resolve = async (source, args, context, info) => {
    const extensionStack = context && context._extensionStack
    const handler = extensionStack && extensionStack.willResolveField(source, args, context, info)

    try {
      let result
      let dataID
      const isQuery = isQueryOp(info)

      const expire = getExpire(info)

      if (isQuery && !R.isEmpty(expire) && expire.maxAge > 0) {
        let argumentsIDObj = {}
        if (!R.isEmpty(args)) {
          argumentsIDObj = Object.assign({}, args)
        }
        if (!R.isEmpty(source)) {
          argumentsIDObj = Object.assign(argumentsIDObj, source)
        }

        // const filedsObj = R.keys(graphqlFields(info))

        const fieldsObj = graphqlFields(info)
        const argsStr = (!R.isEmpty(argumentsIDObj) && hash(argumentsIDObj, { algorithm: 'md5', encoding: 'base64' })) || ''
        const fieldsStr = (!R.isEmpty(fieldsObj) && hash(fieldsObj, { algorithm: 'md5', encoding: 'base64' })) || ''
        // typeName_arguments_fileds
        dataID = `miaaa.${field.type.name}_${argsStr}_${fieldsStr}`
        console.log('====================================')
        console.log(dataID)
        console.log('====================================')
        dataID = MD5(dataID)
        console.log('====================================')
        console.log(dataID)
        console.log('====================================')
        result = await context.app.redis.get('cache').get(dataID)
        if (result) {
          result = JSON.parse(result)
          handler(result)
          return result
        }
      }

      result = await (fieldResolver || defaultFieldResolver)(source, args, context, info)
      whenResultIsFinished(result, () => {
        if (handler) {
          handler(result)
        }
      })

      if (isQuery) {
        if (!isScalarType(field.type) && !R.isEmpty(expire) && expire.maxAge > 0) {
          await context.app.redis.get('cache').set(dataID, JSON.stringify(result), 'ex', expire.maxAge)
        }
      }

      return result
    } catch (error) {
      console.log('====================================')
      console.log(error)
      console.log('====================================')
      if (handler) {
        handler()
      }
      throw error
    }
  }
}

const enableGraphQLCache = (schema) => {
  forEachField(schema, wrapField)
  return schema
}

module.exports = enableGraphQLCache
