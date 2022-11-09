module.exports = {
  UserMutate: {
    createExcel: async (user, args, ctx) => {
      const data = await ctx.connector.excel.create(user, args.arg)
      return {
        success: true,
        data
      }
    }
  },
  User: {
    excelList: (user, args, ctx) =>
      ctx.connector.excel.getAll()
  },
  Excel: {
    data: (excel, args, ctx) =>
      ctx.connector.excel.read(excel)
  }
}
