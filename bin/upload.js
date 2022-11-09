/*eslint-disable*/

const { resolve } = require('path')
const fs = require('fs')
const glob = require('glob')
const R = require('ramda')
const task = require('./build')
const uploadOss = require('./oss')
const conf = require('../build/webpack.prod.conf.js')
const packageJson = require('../package.json')

const start = async () => {
  await task()
  const files = glob.sync(resolve(__dirname, '../dist/assets/**/*.+(js|css)'))

  for (let i of files) {
    const filename = i.split(resolve(__dirname, '../dist/assets/'))[1]

    await uploadOss({
      packageName: `miaaa/${packageJson.version}${filename}`,
      packagePath: i
    })
  }

  const index = fs.readFileSync(resolve(__dirname, '../dist/assets/index.html'), 'utf8')
  const manifest = fs.readFileSync(resolve(__dirname, '../dist/assets/manifest.json'), 'utf8')

  const newIndex = index.replace(/rel=manifest href=\//, `rel=manifest href=/public/`)

  fs.writeFileSync(resolve(__dirname, '../app/index.html'), newIndex, 'utf8')
  fs.writeFileSync(resolve(__dirname, '../app/public/manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  process.exit()
}

start()
