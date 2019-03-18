const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { dbConfig } = require('../config')

module.exports = new MySQLStore(dbConfig)
