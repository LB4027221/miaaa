import hoistNonReactStatic from 'hoist-non-react-statics'
import React, { Component } from 'react'
import { message } from 'antd'
import { dotPathOr } from 'ramda-extension'

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

const mutatable = ({ mutationName = 'mutate', name = 'mutatehoc', path } = {}) =>
  (SourceComponent) => {
    class Mutatable extends Component {
      state = {
        loading: false,
        error: ''
      }

      _handleSuccess = res => {
        const data = dotPathOr({}, path, res)
        if (!data.success) {
          return message.error('操作失败')
        }

        return message.success('操作成功')
      }

      doWhileSuccess = (cb, res) => {
        this.setState({
          loading: false
        }, () => cb(res))
      }

      submit = (variables, handleSuccess = this._handleSuccess) => {
        this.setState({ loading: true, error: '' })

        this.props[mutationName]({ variables })
          .then(res => this.doWhileSuccess(handleSuccess, res))
          .catch((error) => {
            this.setState({ loading: false, error: error.message })
          })
      }

      mapProps = () => {
        const statusProps = {
          [name]: {
            loading: this.state.loading,
            error: this.state.error,
            submit: this.submit
          }
        }

        return { ...this.props, ...statusProps }
      }

      render() {
        return (
          <SourceComponent
            {...this.mapProps()}
          />
        )
      }
    }

    Mutatable.displayName = `Mutatable(${getDisplayName(SourceComponent)})`
    hoistNonReactStatic(Mutatable, SourceComponent)
    return Mutatable
  }

export default mutatable
