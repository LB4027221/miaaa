const { GRPCHelper } = require('grpc-helper')

module.exports = async app => {
 app.grpc = await createGrpcClient(app)
};

async function createGrpcClient(app) {
  const clients = {}
  const configs = app.config.grpc.clients

  for (let i = 0, len = configs.length; i < len; i++) {
    const config = configs[i]
    const client = new GRPCHelper(config)
    await client.waitForReady()
    clients[config.serviceName] = client
    app.coreLogger.info(`[egg-grpc-client] ${config.serviceName} init instance success`)
    if (config.serviceName === 'Build') {
      // const res = await client.Build({
      //   reportId: 'test',
      //   host: 'rm-bp1enc0yrzt3zu60do.mysql.rds.aliyuncs.com',
      //   user: 'sxc_test',
      //   sql: "select ( DATE_FORMAT(a.`gmt_create`, \'%Y/%m/%d\') ) as `下单日期`, ( a.`trade_line_name` ) as `业务线`, ( a.`city_name` ) as `城市`, ( sum(a.`gmv`)/1000000 ) as `gmv`, ( COUNT(DISTINCT(a.`buyer_id`)) ) as `客户数` from dw.rpt_order_info a where (a.`pay_time` >= \'2019-06-01 00:00:00\' and a.`pay_time` <= \'2019-06-30 23:59:59\') and a.`owns` = 1 group by a.`gmt_create`,a.`trade_line_name`,a.`city_name` limit 100000",
      //   passwd: 'Songxiaocai2015',
      //   worksheetName: '业务线GMV趋势表',
      //   filename: '/python/template/5cf87abeef3e910457616536.xlsx',
      //   output: {},
      //   conf: [],
      //   clearSource: true
      // })
      // console.log(res)

      // const res = await client.GetBuild({
      //   reportId: 'test'
      // })
      // const data = JSON.parse(JSON.parse(res.data))
      // console.log(data)

      // const res = await client.Read({
      //   reportId: '5cf87abeef3e910457616536'
      // })
      // console.log(typeof JSON.parse(res.data))
    }
  }

  return clients;

}

