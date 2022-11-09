/*eslint-disable*/

const OSS = require('ali-oss')
const co = require('co')
const { green, red } = require('chalk')

const APPLICATIONDIR = 'code_platform/testUp'
const BUCKETDOMAINURL = 'https://dev-sxc-pesticide.oss-cn-hangzhou.aliyuncs.com'
const BUCKET = 'dev-sxc-pesticide'

const ossOptions = {
  region: 'oss-cn-hangzhou',
  accessKeyId: 'EUP0QELW1y2YkSgB',
  accessKeySecret: 'dfmLyD9uLvb7E2VE3CUKTwyviooouI',
  endpoint: 'http://oss-cn-hangzhou.aliyuncs.com'
}
const client = new OSS(ossOptions)

function uploadOss({ packagePath, packageName }) {
  return new Promise((resolve, reject) => {
    co(function * () {
      client.useBucket(BUCKET)
      yield client.put(`/${APPLICATIONDIR}/${packageName}`, packagePath)
      return resolve()
    }).catch(err => {
      reject(err)
    })
  })
}

const uploadPakage = async ({ packagePath, packageName }) => {
  console.log(`----- 正在上传 ${packageName} -----`)
  try {
    await uploadOss({ packagePath, packageName })
    const applicationUrl = `${BUCKETDOMAINURL}/${APPLICATIONDIR}/${packageName}`
    console.log(green(`----- 上传成功，地址：${applicationUrl} -----`))
    return applicationUrl
  } catch (e) {
    console.log(red('----- 上传出错 -----'))
    throw new Error(e)
  }
}

module.exports = uploadPakage
