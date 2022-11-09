module.exports = {
  UserMutate: {
    updateChart: (user, args, ctx) => ctx.connector.chart.update(args),
    removeChart: (user, args, ctx) => ctx.connector.chart.remove(args)
  },
  Worksheet: {
    charts: (worksheet, args, ctx) =>
      ctx.connector.chart.find(worksheet)
  },
  Report: {
    charts: (report, args, ctx) =>
      ctx.connector.chart.findByReport(report._id, args)
  },
  User: {
    chart: (user, args, ctx) =>
      ctx.connector.chart.findById(args.chartId, args)
  },
  Chart: {
    data: (chart, args, ctx) =>
      ctx.connector.chart.getDataFromCache(chart),
    refs: (chart, args, ctx) =>
      ctx.connector.chart.getRefs(chart)
  }
}
