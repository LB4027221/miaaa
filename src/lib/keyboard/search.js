import { of, merge, fromEvent } from 'rxjs'
import { mapTo, switchMap, filter, scan, startWith, map } from 'rxjs/operators'
import equals from 'ramda/src/equals'
import dissoc from 'ramda/src/dissoc'

import { filterId } from '../index'

const codeMap = {
  70: false,
  68: false
}

const keydown$ = fromEvent(document, 'keydown')
  .pipe(map(e => ({ [e.keyCode]: true })))

const keyup$ = fromEvent(document, 'keyup')
  .pipe(map(e => ({ [e.keyCode]: false })))

const watchPress$ = merge(
  keydown$,
  keyup$
).pipe(
  startWith(codeMap),
  scan((acc, item) => ({ ...acc, ...item }), codeMap),
  switchMap((codes) => {
    const onPressCodes = filterId(dissoc(229, codes))

    return of(onPressCodes)
  }),
  filter(item => equals(Object.keys(item), ['68', '70'])),
  mapTo(true)
)

export default watchPress$
