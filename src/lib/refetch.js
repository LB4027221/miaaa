import { withState, withHandlers, compose } from 'recompose'

const withRefetch = (key = 'data') => compose(
  withState(`${key}Refetching`, `refetch${key}`, false),
  withHandlers({
    [`refetch${key}`]: props => async () => {
      props[`refetch${key}`](s => !s)
      await props[key].refetch()
      props[`refetch${key}`](s => !s)
    }
  })
)

export default withRefetch
