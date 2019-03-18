const mysql = require('mysql')
const { dbConfig } = require('../config')

const pool = mysql.createPool(dbConfig)

module.exports = pool
