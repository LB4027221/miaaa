import { init } from '@rematch/core'
import models, { keyup$ } from './models'

const store = init({
  models
})

keyup$.subscribe(payload => store.dispatch({
  type: 'dataSource/onSearch',
  payload
}))

export default store

