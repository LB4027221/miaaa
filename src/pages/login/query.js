import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { message } from 'antd'

const { localStorage } = window

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const LOGIN = gql`
  mutation LOGIN (
    $mobilePhone: String!,
    $password: String!
  ) {
    login(
      mobilePhone: $mobilePhone,
      password: $password
    ) {
      success
      errorCode
      errorMessage
      result{
        userId
        userName
        mobilePhone
        sessionId
        userType
      }
    }
  }
`

export default graphql(LOGIN, {
  props: ({ mutate, ownProps }) => ({
    login: (form) => {
      form.validateFields(async (err, formData) => {
        const { mobilePhone, password } = formData
        ownProps.toggleLoading(x => !x)
        mutate({
          variables: {
            mobilePhone,
            password
          },
          update: async (proxy, { data: { login } }) => {
            if (!login.success) {
              ownProps.toggleLoading(x => !x)
              return message.error(login.errorMessage)
            }
            console.log(login)
            // await localStorage.setItem('rua', login.result)
            // await sleep(500)

            // window.location.reload()
            return null
          }
        })
      })
    }
  })
})
