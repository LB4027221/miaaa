import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const INIT_MASTER = gql`
query queryMaster($_id: ID!) {
  master(_id: $_id) {
    __typename
    _id
    name
    cname
    SQL
    countSQL
    components {
      __typename
      _id
      cname
      name
      key
      state
      label
      defaultValue
    }
    fullComponents {
      __typename
      _id
      cname
      name
      key
      state
      label
      defaultValue
    }
  }
}
`
export default graphql(INIT_MASTER)
