import React from 'react'
import { HotTable } from '@lib/handsontable'
import { Button } from 'antd'

const conf = {
  stretchH: 'all',
  // width: 1000,
  // height: 800,
  autoWrapRow: true,
  rowHeaders: true,
  colHeaders: true,
  manualRowMove: true,
  manualColumnMove: true,
  // contextMenu: true,
  // filters: true,
  // fixedRowsTop: true,
  readOnly: false,
  // dropdownMenu: true,
  formulas: true,
  language: 'zh-CN'
}


const Viewer = ({
  data,
  worksheet
}) => {
  let hot
  const exportFile = () => {
    const exportPlugin = hot.hotInstance.getPlugin('exportFile')
    exportPlugin.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: `${worksheet}_[YYYY]-[MM]-[DD]`,
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: false,
      encoding: 'utf-8'
    })
  }
  return (
    <div>
      <HotTable
        ref={ref => hot = ref}
        data={data}
        {...conf}
      />
      <Button onClick={() => exportFile()} type='primary'>
        下载
      </Button>
    </div>
  )
}

export default Viewer
