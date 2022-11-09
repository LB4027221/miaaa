/*eslint-disable*/

const { resolve } = require('path')
const { rm } = require('shelljs')
const webpack = require('webpack')
const conf = require('../build/webpack.prod.conf.js')

const r = path => resolve(process.cwd(), path)

const compiler = webpack(conf)

rm('-rf', r('./dist'))

const task = () => new Promise((resolve) => {
  compiler.run(function (err, stats) {
    if (err) process.stdout.write(err)
    console.log('[webpack:build]', stats.toString({
      chunks: true,
      colors: true
    }))
    resolve()
  })
})

module.exports = task
