import React from 'react'

const View = ({ match }) => (
  <div>
    <h1>{match.params.id}</h1>
  </div>
)

export default View
