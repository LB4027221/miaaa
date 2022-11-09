import propEq from 'ramda/src/propEq'

const shouldAuthorization = propEq('authorization', true)

const removeAdmin = (value) => {
  if (value === null || value === undefined) {
    return value
  } else if (Array.isArray(value)) {
    return value.filter(item => !shouldAuthorization(item)).map(v => removeAdmin(v))
  } else if (typeof value === 'object') {
    const newObj = {}
    Object.entries(value).forEach(([key, v]) => {
      newObj[key] = removeAdmin(v)
    })
    return newObj
  }
  return value
}

export default removeAdmin
