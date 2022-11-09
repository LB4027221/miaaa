module.exports = () => async function initUser(ctx, next) {
  const isRenderHtml = ctx.url === '/'
    || ctx.url.includes('#')
    || ctx.path === '/graphql'
    || ctx.path === '/sub'
    || ctx.path === '/graphiql'

  if (!isRenderHtml) {
    ctx.user = await ctx.service.user.getInfo()
  }

  await next()
}
