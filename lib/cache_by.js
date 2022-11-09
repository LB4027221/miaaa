const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const myTask = async (app, key, filename) => {
  const file = await new FileAsync(filename)
  const data = await low(file)

  app.lowdbCache[key] = data
}

module.exports = myTask
