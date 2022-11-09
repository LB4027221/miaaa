import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'

// "ing":114.37484463044197,"lat":30.612747065150252,"

class MapBox extends Component {
  state = {
    viewport: {
      width: 800,
      height: 400,
      latitude: 30.612747065150252,
      longitude: 114.37484463044197,
      zoom: 8
    }
  };

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken='pk.eyJ1IjoiemV6aGlwZW5nIiwiYSI6ImNpbzI4dmYyNzFheDV1a20zMmE4cGI2cXMifQ.fxSy_TauGhdQrQXOO-cMKg'
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    )
  }
}

export default MapBox
