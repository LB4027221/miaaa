module.exports = {
  UserMutate: {
    updateExtRes: async (user, args, ctx) => {
      const data = await ctx.connector.ext.updateExt(user, args.data)
      return {
        success: true,
        data
      }
    }
  },
  User: {
    ext: (user, args, ctx) =>
      ctx.connector.ext.findOne(args)
  }
}
