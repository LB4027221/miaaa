const {
  parser,
  parserCountSQL
} = require('./parser')

module.exports = (app) => {
  app.addSingleton('ast', {
    parser,
    parserCountSQL
  })
}
