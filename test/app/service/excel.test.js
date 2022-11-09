const { app, assert } = require('egg-mock/bootstrap')
const path = require('path')

const filename = path.resolve(__dirname, '../../../output/5a24afc0b74953115a4a3810/5bf270141990075770837ba6.xlsx')

describe('calc()', () => {
  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext()
    // 通过 ctx 访问到 service.user
    const res = await ctx.service.excel.calc(filename)
    assert(res)
  })
})
