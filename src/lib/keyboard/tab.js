import { fromEvent } from 'rxjs'
import { mapTo, filter, map, debounceTime } from 'rxjs/operators'

const code = 9

const tab$ = fromEvent(document, 'keydown')
  .pipe(
    map(e => e.keyCode),
    filter(c => c === code),
    mapTo(true),
    debounceTime(300)
  )

export default tab$
