module.exports = {
  Query: {
    groups: (obj, args, ctx) =>
      ctx.connector.group.getGroups()
  },
  UserMutate: {
    addReportsGroup: (obj, { group }, ctx) =>
      obj && ctx.connector.group.addReportsGroup(obj, group),
    updateReportsGroup: (obj, { group }, ctx) =>
      obj && ctx.connector.group.updateReportsGroup(obj, group),
    delReportsGroup: (obj, { groupId }, ctx) =>
      obj && ctx.connector.group.delReportsGroup(obj, groupId)
  }
}
