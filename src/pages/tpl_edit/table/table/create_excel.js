import React from 'react'
import { Drawer, Button, Input } from 'antd'
import { HotTable } from '@lib/handsontable'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withCreateExcel, withExcelList } from '@gql'
import mutate from '@lib/mutate'

// import 'handsontable-pro/dist/handsontable.full.css'

const conf = {
  data: [['', '', '', '', '', '']],
  stretchH: 'all',
  width: 600,
  height: 500,
  autoWrapRow: true,
  rowHeaders: true,
  colHeaders: true,
  manualRowMove: true,
  manualColumnMove: true,
  contextMenu: true,
  filters: false,
  fixedRowsTop: true,
  readOnly: false,
  dropdownMenu: true,
  formulas: true,
  language: 'zh-CN'
}


let hot

const CreateExcel = ({
  visible,
  onChildrenDrawerClose,
  createExcel,
  data,
  title,
  changeTilte,
  createExcelHoc
}) => (
  <Drawer
    title='新建 Excel'
    width={700}
    closable={false}
    onClose={onChildrenDrawerClose('newChild')}
    visible={visible}
    style={{
      height: 'calc(100% - 55px)',
      overflow: 'auto',
      paddingBottom: 53
    }}
  >
    <br />
    <Input
      value={title}
      onChange={e => changeTilte(e.target.value)}
      placeholder='表格名称'
      style={{ width: 600 }}
    />
    <br />
    <br />
    <HotTable
      {...conf}
      data={data}
      ref={ref => hot = ref}
    />
    <br />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '10px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px'
      }}
    >
      <Button
        onClick={() => createExcel(hot)}
        type='primary'
        loading={createExcelHoc.loading}
      >
        提交
      </Button>
    </div>
  </Drawer>
)

const mapState = state => ({
  data: state.newExcel.data,
  title: state.newExcel.title
})

const mapDispatch = (dispatch, ownProps) => ({
  changeTilte: dispatch.newExcel.changeTilte,
  createExcel: () => dispatch
    .newExcel
    .createExcel({
      createExcel: ownProps.createExcelHoc.submit,
      hot,
      excelList: ownProps.excelList,
      close: ownProps.close
    })
})

export default compose(
  withCreateExcel,
  withExcelList,
  mutate({ mutationName: 'createExcel', name: 'createExcelHoc' }),
  connect(mapState, mapDispatch),
)(CreateExcel)
