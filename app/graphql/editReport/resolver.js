
module.exports = {
  UserMutate: {
    toggleOnline: (obj, args, ctx) =>
      ctx.connector.editReport.toggleOnline(obj, args),
    editReport: (obj, args, ctx) =>
      ctx.connector.editReport.edit(obj, args)
  },
  ReportRes: {
    metaList: (obj, args, ctx) =>
      ctx.connector.editReport.editMeta(obj, args, ctx),
    tabBorthers: (obj, args, ctx) =>
      ctx.connector.editReport.editTabs(obj, args, ctx)
  }
}
