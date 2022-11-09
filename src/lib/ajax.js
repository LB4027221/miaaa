import { ajax } from 'rxjs/ajax'
import { streamProps } from 'react-streams'
import { pipe } from 'rxjs'
import { pluck, switchMap } from 'rxjs/operators'

export const query$ = ({ body = {}, url, method = 'GET' }) => ajax({
  url,
  method,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body
})

const fetcher$ = pipe(
  switchMap(query$),
  pluck('response')
)

export default streamProps(fetcher$)
