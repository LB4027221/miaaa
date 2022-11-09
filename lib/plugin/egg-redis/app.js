const redis = require('./lib/redis')

module.exports = (app) => {
  redis(app)
}
