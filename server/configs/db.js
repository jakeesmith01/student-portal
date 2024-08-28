var Knex = require('knex')

var config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || 5432, 10)
  },
  migrations: {
    tableName: 'migrations',
    directory: '../migrations'
  },
}

module.exports = config