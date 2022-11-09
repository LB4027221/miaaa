module.exports = {
  Query: {
    database: (obj, args, ctx) => ctx.connector.database.getDatabaseList(obj, args, ctx)
  },
  Database: {
    tables: (obj, args, ctx) => {
      let database = obj.name
      let names = args.names || []
      return ctx.connector.database.getTableList(obj, { database, names, ...args })
    }
  },
  Table: {
    columns: (obj, args, ctx) => {
      let database = obj.database
      let table = obj.name
      return ctx.connector.database.getColumns(obj, { database, table })
    }
  }
}
