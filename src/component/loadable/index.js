import Loadable from 'react-loadable'
import DefaultLoading from './loading'

const withLoadable = ({ loader, Loading }) => Loadable({
  loader: () => loader,
  loading: Loading || DefaultLoading
})

export default withLoadable
