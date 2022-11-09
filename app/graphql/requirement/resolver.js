module.exports = {
  Mutation: {
    updateRequirement: (obj, args, ctx) =>
      ctx.connector.requirement.updateRequirement(args)
  },
  UserMutate: {
    beingAuthorizated: (obj, args, ctx) =>
      obj && ctx.connector.requirement.authorization(args)
  }
}
