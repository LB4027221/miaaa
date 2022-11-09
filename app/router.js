module.exports = (app) => {
  const { router, controller } = app

  router.get('/', controller.home.page)
  router.post('/requirement', controller.requirement.add)
  router.get('/logout', controller.user.logout)
  router.get('/export', controller.user.exportExcel)
  router.get('/records/userList', controller.user.getUserList)
  router.put('/report/:_id', controller.report.updateReport)
  router.get('/report/copy', controller.report.copy)
  router.get('/sqltrace', controller.sqltrace.find)
  router.get('/report/list', controller.report.findList)
  router.get('/records/list', controller.record.findList)
  router.get('/records/dayCount', controller.record.RecordDayCount)
  router.get('/records/statistic', controller.record.statistic)
  router.get('/records/sort', controller.record.getRecordSort)
  router.get('/records/ranking/list', controller.record.getRankingList)
  // 上传文件
  router.post('/upload', controller.upload.index)
  router.get('/downloadTpl', controller.home.downloadTpl)
  router.get('/downloadData', controller.home.downloadData)
  router.get('/sub', controller.dingtalk.msg)

  app.io.route('chat', controller.socket.index)
}
