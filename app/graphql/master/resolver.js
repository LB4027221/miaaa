module.exports = {
  Query: {
    master: (obj, args, ctx) =>
      ctx.connector.master.findOne(args)
  },
  Mutation: {
    updateMaster: (obj, args, ctx) =>
      ctx.connector.master.updateRequirement(obj, args)
  },
  Master: {
    components: (obj, args, ctx) =>
      ctx.connector.master.findComponents(obj, args),
    fullComponents: (obj, args, ctx) => obj.toObject().components,
    dataSource: (obj, args, ctx) =>
      ctx.connector.master.findFeed(obj, args),
    columns: (obj, args, ctx) =>
      ctx.connector.master.makeColumns(obj),
    total: (obj, args, ctx) =>
      ctx.connector.master.getTotal(obj, args)
  }
}
