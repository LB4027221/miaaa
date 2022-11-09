const colors = {
  blue3: '#e6f7ff',
  blue: 'rgb(24, 144, 255)',
  deepblue: 'rgb(0, 33, 64)',
  white: '#fff',
  creamyWhite: '#f9f9f9'
}

const flexRowCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const flexColumnCenter = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const display = {
  flexColumnCenter,
  flexRowCenter
}

const events = {
  pointer: {
    cursor: 'pointer'
  }
}

const unit = 1

const primary = colors.blue
const primary1 = colors.blue3

const theme = {
  display,
  colors,
  events,
  primary,
  primary1,
  unit
}

export default theme
