import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const INIT = gql`
query INIT_LIST {
  reports{
    __typename
    key:_id
    name
    cname
    status
    usedOn
    tags
    user{
      __typename
      userName
    }
    editor{
      __typename
      userName
    }
    createAt
    updateAt
    tags
  }
}
`

const init = graphql(INIT)

export default init
