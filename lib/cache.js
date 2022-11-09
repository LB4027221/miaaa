const glob = require('glob')
const { resolve } = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const cacheMap = {}
glob
  .sync(resolve(__dirname, '../output/*.json'))
  .map(i => ({
    key: i.split('/').pop().replace(/.json/, ''),
    file: low(new FileSync(i))
  }))
  .forEach(i => cacheMap[i.key] = i.file)

const myTask = (app) => {
  app.lowdbCache = cacheMap
}

module.exports = myTask
