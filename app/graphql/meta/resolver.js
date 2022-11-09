module.exports = {
  Requirement: {
    metaList: (obj, args, ctx) =>
      ctx.connector.meta.updateMeta(obj, args)
  }
}
