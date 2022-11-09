module.exports = {
  User: {
    schedule: (user, args, ctx) =>
      ctx.connector.schedule.findById(args.report)
  }
}
