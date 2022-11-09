module.exports = {
  UserMutate: {
    updateReportChart: (user, args, ctx) => ctx.connector.reportchart.update(args),
    removeReportChart: (user, args, ctx) => ctx.connector.reportchart.remove(args)
  },
  Report: {
    ncharts: (report, args, ctx) =>
      ctx.connector.reportchart.findByReport(report)
  }
}
