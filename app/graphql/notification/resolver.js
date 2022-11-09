// import { withFilter } from 'graphql-subscriptions'

module.exports = {
  Subscription: {
    notification: {
      resolve: payload => payload,
      subscribe: (payload, args, ctx) =>
        ctx.app.pubsub.asyncIterator(`${args.userId}${ctx.app.config.pubsub.notification}`)
    }
  }
}
