module.exports = {
  Query: {
    user: (obj, args, ctx) =>
      ctx.connector.user.getInfo(args)
  },
  User: {
    roles: (obj, args, ctx) =>
      ctx.connector.user.getRoles(obj),
    dingding: (obj, args, ctx) =>
      ctx.connector.user.getDingInfo(obj),
    subscription: (user, args, ctx) =>
      ctx.connector.user.getSubscription(user)
  },
  Mutation: {
    user: (obj, args, ctx) =>
      ctx.connector.user.getInfo(),
    login: (obj, args, ctx) =>
      ctx.service.userCenter.login(args)
  },
  UserMutate: {
    editFavorite: (obj, args, ctx) =>
      ctx.connector.user.editFavorite(obj, args),
    subscribe: (user, args, ctx) =>
      ctx.connector.user.subscribe(args),
    unsubscribe: (user, args, ctx) =>
      ctx.connector.user.unsubscribe(args)
  },
  Subscription: {
    notice: {
      resolve: payload => payload,
      subscribe: (payload, args, ctx) =>
        ctx.app.pubsub.asyncIterator(`${args.userId}${ctx.app.config.pubsub.messages}`)
    }
  }
}
