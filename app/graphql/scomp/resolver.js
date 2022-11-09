module.exports = {
  Query: {
    scomp: (obj, args, ctx) =>
      ctx.connector.scomp.find(obj)
  },
  UserMutate: {
    newScomp: (obj, args, ctx) =>
      ctx.connector.scomp.create(obj, args),
    editScomp: (obj, args, ctx) =>
      ctx.connector.scomp.edit(obj, args)
  }
}
