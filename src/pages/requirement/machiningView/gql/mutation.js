import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const EDIT_REPORT = gql`
mutation editReport($_id: ID!, $data: Any!) {
    user {
      __typename
      editReport(_id: $_id, report: $data){
        __typename
        success
        tabBorthers(report: $data){
          _id
          cname
        }
        errorMessage
        result{
          cname
        }
      }
    }
  }
`
const withEditReport = graphql(EDIT_REPORT)
export default withEditReport
