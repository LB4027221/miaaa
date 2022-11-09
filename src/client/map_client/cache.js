/* eslint-disable */

import { InMemoryCache } from 'apollo-boost'

export const cacheRedirects = {
  User: {
    tpl: (_, args, { cache }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Tpl' })),
    // reports: (_, args, { cache }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Reports' }))
  }
}

export const dataIdFromObject = (object) => {
  switch (object.__typename) {
    case 'Tpl':
      return object._id
    case 'Worksheet':
      return object._id
    default:
      return object.id || object._id || null
  }
}

const cache = (cacheRedirects, dataIdFromObject, fragmentMatcher) => new InMemoryCache({
  fragmentMatcher,
  dataIdFromObject,
  addTypename: true,
  cacheRedirects
})

export default config => cache(
  config.cacheRedirects || cacheRedirects,
  config.dataIdFromObject || dataIdFromObject,
  config.fragmentMatcher
)
