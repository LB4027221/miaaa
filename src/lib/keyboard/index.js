import { fromEvent, from } from 'rxjs'
import { flatMap, map, windowCount, sequenceEqual, filter } from 'rxjs/operators'

import codes from './codes'

const miaaa$ = from(codes)
const keyup$ = fromEvent(document, 'keyup')

const yahaha$ = keyup$.pipe(
  map(e => e.keyCode),
  windowCount(10, 1),
  map(x$ => sequenceEqual(miaaa$)(x$)),
  flatMap(x => x),
  filter(equal => equal)
)

// keyup$.subscribe(yahaha$)

export default yahaha$
