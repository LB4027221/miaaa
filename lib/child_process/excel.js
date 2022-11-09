const mysql = require('mysql')
const R = require('ramda')
const Excel = require('exceljs')
const { resolve } = require('path')

const [, NODE_ENV, SQL, PUBLIC_PATH, WORKSHEET] = process.argv
const FIVE_MIN = 5 * 60 * 1000

const env = NODE_ENV === 'production'
  ? 'prod'
  : 'local'

const r = p => resolve(process.cwd(), p)

const configPath = './config/config.' + env // eslint-disable-line
const base64Path = './lib/base64'
const config = require(r(configPath)) // eslint-disable-line
const { decode } = require(r(base64Path)) // eslint-disable-line

const filterColumns = R.compose(
  R.map(item => ({ header: item, key: item })),
  R.keys
)

const option = {
  host: config.rds.client.host,
  port: 3306,
  user: config.rds.client.user,
  password: config.rds.client.password,
  supportBigNumbers: true,
  dateStrings: true,
  timezone: 'CN',
  connectTimeout: FIVE_MIN,
  trace: false
}

const excelProcess = async () => {
  const conn = mysql.createConnection(option)
  const opt = {
    filename: decode(PUBLIC_PATH),
    useStyles: true
  }

  const workbook = new Excel.stream.xlsx.WorkbookWriter(opt)
  const worksheet = workbook.addWorksheet(WORKSHEET)

  let i = 0
  let headers
  const startTime = Date.now()
  conn
    .query({
      sql: decode(SQL),
      timeout: FIVE_MIN
    })
    .on('error', (err) => {
      const endTime = Date.now()
      process.send(JSON.stringify({
        startTime,
        endTime,
        state: 0
      }))
      process.stderr.write(err)
      process.exit(1)
    })
    .on('result', async (row) => {
      if (!i) {
        headers = filterColumns(row)
        worksheet.columns = headers
      }

      i++

      worksheet.addRow(row).commit()
    })
    .on('end', async () => {
      const endTime = Date.now()
      process.send(JSON.stringify({
        startTime,
        endTime,
        state: 1
      }))
      await worksheet.commit()

      workbook
        .commit()
        .then(() => {
          // 写入完成后，发射到 workbook 流里面
          workbook.stream.end()
        })
    })

  // 完成后退出
  workbook.stream.on('close', () => {
    conn.pause()

    process.exit(0)
  })
}

excelProcess()
