import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_MASTER = gql`
mutation mutateMaster($data: MasterUpdateArgs, $_id: ID!) {
  master: updateMaster(data: $data, _id: $_id) {
    _id
    name
    cname
    SQL
    components {
      _id
      cname
      name
      state
      label
      defaultValue
    }
  }
}
`
const withUpdateMaster = graphql(UPDATE_MASTER)
export default withUpdateMaster
