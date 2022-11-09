import React, { createContext, Component } from 'react'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

const Ctx = createContext()

class Provider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }

    const keyup$ = new Subject()
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )

    keyup$.subscribe(search => this.setState({ search }))

    this.keyup$ = keyup$
  }

  onSearch = ({ target }) => {
    const { value } = target
    this.keyup$.next(value)
  }

  render() {
    return (
      <Ctx.Provider
        value={{
          search: this.state.search,
          onSearch: this.onSearch
        }}
      >
        {this.props.children}
      </Ctx.Provider>
    )
  }
}

export default Provider
export const { Consumer } = Ctx
