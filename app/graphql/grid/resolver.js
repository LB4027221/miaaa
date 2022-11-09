const {
  pickAll, compose, filter, identity
} = require('ramda')
const Promise = require('bluebird')
// const path = require('path')

const PICK_KEYS = [
  '_id',
  'title',
  'sort',
  'status',
  'description'
]
const beforeUpdate = compose(
  filter(identity),
  pickAll(PICK_KEYS)
)

module.exports = {
  User: {
    myGrid: (user, args, ctx) =>
      ctx.connector.grid.getUserGrid(user),
    gridList: (user, args, ctx) =>
      ctx.connector.grid.findByUser(user),
    grid: (user, args, ctx) =>
      ctx.connector.grid.findById(args._id)
  },
  GridItem: {
    chart: gridItem => gridItem.chart
  },
  UserMutate: {
    updateGrid: async (user, args, ctx) => {
      const { file } = ctx.request.body.variables
      try {
        let name
        let stream
        if (file) {
          const { createReadStream, filename } = await file
          stream = createReadStream()
          name = `miaaa/poster/${filename}`
        }
        const formatData = beforeUpdate(args.data)
        const _items = await Promise
          .map(args.data.items, ctx.connector.grid.updateItem(ctx))
        const items = _items.map(i => i._id)
        const data = {
          ...formatData,
          items,
          snapshot: name
        }

        return ctx.connector.grid.update(user, data, stream, name)
      } catch (e) {
        console.log('========updateGrid=================')
        console.log(e)
        console.log('====================================')
        return {
          success: false,
          message: e.message
        }
      }
    }
  }
}
