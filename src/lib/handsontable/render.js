import { fastInnerHTML } from 'handsontable/es/helpers/dom/element'
import { getRenderer } from 'handsontable/es/renderers'
import moment from 'moment'
// import numeral from 'numeral'

const isMoney = (key) => {
  if (key) {
    const _key = key.toLowerCase()
    return _key.includes('gmv') || _key.includes('额') || _key.includes('价')
  }

  return false
}
const mapMoney = (col) => {
  const is = isMoney(col)

  return is
    ? '$0,0'
    : ''
}
const addW = key => (key && key.includes('万') && isMoney(key)
  ? '万'
  : '')
const mapNumberPattern = col => `${mapMoney(col)}`

function dateRenderer(instance, TD, row, col, prop, value) {
  for (var _len = arguments.length, args = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
    args[_key - 6] = arguments[_key]
  }

  TD.style = 'color: rgba(0,0,0,0.44);'
  getRenderer('base').apply(this, [instance, TD, row, col, prop, value].concat(args))
  fastInnerHTML(TD, value === null || value === void 0 ? '' : moment(value).utcOffset(0).format('YYYY.MM.DD'))
}

function numRenderer(instance, TD, row, col, prop, value) {
  for (var _len = arguments.length, args = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
    args[_key - 6] = arguments[_key]
  }

  TD.style = 'font-weight: 500;color: rgba(0,0,0,0.7);'
  getRenderer('base').apply(this, [instance, TD, row, col, prop, value].concat(args))

  fastInnerHTML(TD, value === null || value === void 0 ? '' : isMoney(prop) ? `¥${value}` : value)
}


function htmlRenderer(instance, TD, row, col, prop, value) {
  for (var _len = arguments.length, args = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
    args[_key - 6] = arguments[_key]
  }

  TD.style = 'color: rgba(0,0,0,0.85);'
  getRenderer('base').apply(this, [instance, TD, row, col, prop, value].concat(args))
  fastInnerHTML(TD, value === null || value === void 0 ? '' : value)
}


const mapType = (col) => {
  switch (col.type) {
    case 'datetime':
      return {
        data: col.name,
        renderer: dateRenderer
      }
    case 'number':
      return {
        data: col.name,
        renderer: numRenderer
      }
    case 'integer':
      return {
        data: col.name,
        renderer: numRenderer
      }
    default:
      return {
        data: col.name,
        renderer: htmlRenderer
      }
  }
}

export default mapType
