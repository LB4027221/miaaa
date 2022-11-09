const encode = str => Buffer
  .from(str, 'utf8')
  .toString('base64')

const decode = str => Buffer
  .from(str, 'base64')
  .toString()


module.exports = {
  encode,
  decode
}
