const R = require('ramda')

module.exports = {
  Query: {
    reports: (obj, args, ctx) =>
      ctx.connector.report.find(args),
    report: (obj, args, ctx) => ctx.connector.report.findOne(args)
  },
  UnionReport: {
    __resolveType: (obj) => {
      if (obj.remarks) {
        return 'Report'
      }

      return 'Master'
    }
  },
  User: {
    reports: async (obj, args, ctx) => {
      const roles = await ctx.connector.user.getRoles(obj)

      const res = await Promise.all([
        ctx.connector.report.findByUser(roles),
        ctx.connector.master.findByUser(roles)
      ])

      return R.flatten(res)
    }
  },
  Report: {
    tabBrothers: (obj, args, ctx) =>
      ctx.connector.report.findTabs(obj, args),
    components: (obj, args, ctx) =>
      ctx.connector.report.findComponents(obj, args),
    fullComponents: (obj, args, ctx) =>
      ctx.connector.report.findFullComponents(obj, args),
    dataSource: (obj, args, ctx) =>
      ctx.connector.report.findDataFeed(obj, args),
    webDataSource: (obj, args, ctx) =>
      ctx.connector.report.findFeed(obj, args),
    columns: (obj, args, ctx) =>
      ctx.connector.report.mapColumns(obj),
    total: (obj, args, ctx) =>
      ctx.connector.report.getTotal(obj, args)
    // build: (obj, args, ctx) =>
    //   ctx.connector.report.build(obj, args)
    // business: (obj, args, ctx) => {
    //   ctx.connector.report.getBusiness(obj, args)
    // }
  },
  Mutation: {
    exportExcel: async (obj, args, ctx) => {
      const report = await ctx.service.report.findById(args.excel._id)
      if (report) {
        return ctx.connector.report.exportExcel(obj, args)
      }

      return ctx.connector.master.exportExcel(obj, args)
    }
  }
}
