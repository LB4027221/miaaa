module.exports = {
  User: {
    summary: async (user, args, ctx) =>
      ctx.connector.summary.findByUser(user, args)
  },
  Summary: {
    children: (obj, args, ctx) =>
      ctx.connector.summary.findSummaryChildren(obj, args),
    dataSource: (obj, args, ctx) =>
      ctx.connector.summary.findDataSource(obj, args)
  },
  SummaryChildren: {
    components: (report, args, ctx) =>
      ctx.connector.summary.findComponents(report, args),
    business: (obj, args, ctx) =>
      ctx.connector.summary.getBusiness(obj, args),
    cat: (obj, args, ctx) =>
      ctx.connector.summary.getCat(obj, args),
    city: (obj, args, ctx) =>
      ctx.connector.summary.getCity(obj, args),
    pickHouseComp: (obj, args, ctx) =>
      ctx.connector.summary.getPickHouse(obj, args)
  }
}
