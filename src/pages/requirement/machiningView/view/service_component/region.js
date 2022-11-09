import React, { Component } from 'react'
import {
  Cascader,
  Radio,
  Select,
  Input
} from 'antd'
import { connect } from 'react-redux'
import R from 'ramda/src'
// import { addRegion, setRegion, delRegion } from '../../action'
import { regionTemplate } from '../../util'

const { Option } = Select

const RadioGroup = Radio.Group
const radioStyle = {
  display: 'block',
  fontSize: '12px',
  height: '18px',
  lineHeight: '18px'
}

const Ssr = ({
  value, placeholder, expType, toggleExp, treeData, inputTarget, inputTargetHandler, setTarget
}) => (
  <div style={{ marginLeft: 10 }}>
    <Select
      value={expType}
      onChange={toggleExp}
    >
      <Option value='select'>选项</Option>
      <Option value='exp'>自定义</Option>
    </Select>
    {expType === 'select'
      ? <Cascader
        showSearch
        value={value}
        style={{ width: 250, marginRight: 10 }}
        options={treeData}
        placeholder={placeholder}
        onChange={setTarget}
      />
      : <Input
        style={{
          width: 200
        }}
        value={inputTarget}
        onChange={inputTargetHandler}
      />
      }
  </div>
)

class Region extends Component {
  state = {
    cityExpType: 'select',
    storeHouseExpType: 'select',
    inputCity: '',
    inputStoreHouse: ''
  }

  toggleCityExp = (expType) => {
    this.setState({
      cityExpType: expType
    })
  }

  toggleStoreHouseExp = (expType) => {
    this.setState({
      storeHouseExpType: expType
    })
  }

  inputCityHandler = ({ target }) => {
    let { value } = target

    this.setState({ inputCity: value })
    value = value.split('.')
    this.setCityTarget(value)
  }

  inputStoreHouseHandler = ({ target }) => {
    let { value } = target
    this.setState({ inputStoreHouse: value })
    value = value.split('.')
    this.setStoreHouseTarget(value)
  }

  setCityTarget = (value) => {
    const zipObj = R.zipObj(['cityTarget', 'cityColumn'])

    value = zipObj(value)
    const { index } = this.props
    const item = Object.assign(this.props.regionComponent, value)
    // this.props.dispatch(setRegion({ item, index }))
    this.props.dispatch.regionComponent.setRegion({ item, index })
  }

  setStoreHouseTarget = (value) => {
    const zipObj = R.zipObj(['storeHouseTarget', 'storeHouseColumn'])

    value = zipObj(value)
    const { index } = this.props
    const item = Object.assign(this.props.regionComponent, value)
    // this.props.dispatch(setRegion({ item, index }))
    this.props.dispatch.regionComponent.setRegion({ item, index })
  }

  componentDidMount() {
    const { regionComponent = {} } = this.props

    if (regionComponent.cityTarget && regionComponent.cityTarget.length < 5) {
      const inputCity = `${regionComponent.cityTarget}.${regionComponent.cityColumn}`
      this.setState({ cityExpType: 'exp', inputCity })
    }
    if (regionComponent.storeHouseTarget && regionComponent.storeHouseTarget.length < 5) {
      const inputStoreHouse = `${regionComponent.storeHouseTarget}.${regionComponent.cityColumn}`
      this.setState({ storeHouseExpType: 'exp', inputStoreHouse })
    }
  }

  render() {
    const {
      regionComponent,
      treeData,
      dispatch,
      index
    } = this.props
    let {
      cityTarget,
      cityColumn,
      storeHouseTarget,
      storeHouseColumn,
      name,
      active,
      show
    } = regionComponent
    let city = cityTarget && cityColumn
      ? [cityTarget, cityColumn]
      : []

    let storeHouse = storeHouseTarget && storeHouseColumn
      ? [storeHouseTarget, storeHouseColumn]
      : []

    const showCitySelect = name === 'cityAndStoreHouse' || name === 'city'
    const showStoreHouseSelect = name === 'cityAndStoreHouse' || name === 'storeHouse'

    return (
      <div className='form-item'>
        <label style={{ marginTop: 5 }}>城市服务站</label>
        <Select
          value={name}
          onChange={(name) => {
            const data = { name }
            const item = Object.assign(regionComponent, data)

            // dispatch(setRegion({ item, index }))
            dispatch.regionComponent.setRegion({ item, index })
          }}
          style={{ width: 120, marginLeft: 10 }}
        >
          <Option value='cityAndStoreHouse'>城市与服务站</Option>
          <Option value='city'>仅城市</Option>
          <Option value='storeHouse'>仅服务站</Option>
        </Select>
        {showCitySelect && <Ssr
          placeholder='城市连接字段'
          treeData={treeData}
          expType={this.state.cityExpType}
          toggleExp={this.toggleCityExp}
          value={city}
          inputTarget={this.state.inputCity}
          inputTargetHandler={this.inputCityHandler}
          setTarget={this.setCityTarget}
        />}
        {showStoreHouseSelect && <Ssr
          placeholder='服务站连接字段'
          treeData={treeData}
          expType={this.state.storeHouseExpType}
          toggleExp={this.toggleStoreHouseExp}
          value={storeHouse}
          inputTarget={this.state.inputStoreHouse}
          inputTargetHandler={this.inputStoreHouseHandler}
          setTarget={this.setStoreHouseTarget}
        />}
        <RadioGroup
          style={{ marginLeft: 10 }}
          value={active}
          onChange={({ target }) => {
            regionComponent.active = target.value
            const item = Object.assign({}, regionComponent)
            // dispatch(setRegion({ item, index }))
            dispatch.regionComponent.setRegion({ item, index })
          }}
        >
          <Radio style={radioStyle} value>作为默认维度</Radio>
          <Radio style={radioStyle} value={false}>只作为赛选组件</Radio>
        </RadioGroup>
        <RadioGroup
          style={{ marginLeft: 10 }}
          value={show}
          onChange={({ target }) => {
            regionComponent.show = target.value
            const item = Object.assign({}, regionComponent)
            // dispatch(setRegion({ item, index }))
            dispatch.regionComponent.setRegion({ item, index })
          }}
        >
          <Radio style={radioStyle} value>显示</Radio>
          <Radio style={radioStyle} value={false}>不显示</Radio>
        </RadioGroup>
        <div
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
            let m = regionTemplate()
            let i = index + 1
            // dispatch(addRegion({ item: m, index: i }))
            dispatch.regionComponent.addRegion({ item: m, index: i })
          }}
        >
          插入
        </div>
        {index
          ? <div
            className='action'
            onClick={(e) => {
            // dispatch(delRegion({ index }))
            dispatch.regionComponent.delRegion({ index })
          }}
          >删除
            </div>
          : ''
        }
      </div>
    )
  }
}

const Container = ({
  regionComponent,
  targets,
  treeData,
  database,
  dispatch
}) => (
  <div>
    {regionComponent.map((item, index) => (
      <Region
        database={database}
        targets={targets}
        treeData={treeData}
        dispatch={dispatch}
        regionComponent={item}
        key={item.key}
        index={index}
      />
    ))}
  </div>
)

export default connect(state => ({
  regionComponent: state.regionComponent,
  targets: state.targets,
  treeData: state.treeData,
  database: state.database
}))(Container)
