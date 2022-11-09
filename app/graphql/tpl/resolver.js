module.exports = {
  User: {
    tpl: (user, args, ctx) =>
      ctx.connector.tpl.findOne(user, args)
  },
  Tpl: {
    workbook: (tpl, args, ctx) =>
      ctx.connector.tpl.read(tpl, args)
  },
  UserMutate: {
    buildExcel: (user, args, ctx) =>
      ctx.connector.tpl.build(user, args),

    updateExcel: (user, args, ctx) =>
      ctx.connector.tpl.update(user, args)
  }
}
