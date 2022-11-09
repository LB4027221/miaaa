import React from 'react'
import { withUpdateGrid } from '@gql'
import { compose } from 'recompose'
import { Button } from 'antd'
// import html2canvas from 'html2canvas'
// import nanoid from 'nanoid'

import withStyles from './styles'

const Submit = ({
  classes,
  updateGridHoc,
  data
}) => (
  <Button
    className={classes.submit}
    loading={updateGridHoc.loading}
    type='primary'
    block
    onClick={() => {
      const variables = {
        data
        // file
      }
      updateGridHoc.submit(variables)
      // html2canvas(el)
      //   .then(canvas => {
      //     const dataURL = canvas.toDataURL('image/png')
      //     const imageFoo = document.querySelector('#pre')
      //     imageFoo.src = dataURL
      //     const blobBin = atob(dataURL.split(',')[1])
      //     const array = []
      //     for (let i = 0; i < blobBin.length; i++) {
      //         array.push(blobBin.charCodeAt(i))
      //     }
      //     const file = new Blob([new Uint8Array(array)], { type: 'image/png' })
      //     file.name = `${nanoid()}.png`
      //     // const formdata = new FormData()
      //     // formdata.append("myNewFileName", file)
      //     const variables = {
      //       data,
      //       file
      //     }
      //     updateGridHoc.submit(variables)
      //   })
    }}
  >
    提交
  </Button>
)

export default compose(
  withStyles,
  withUpdateGrid
)(Submit)
