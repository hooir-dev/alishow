const db = require('./db')

module.exports = (sqlStr, params = [], next) => {
  return new Promise((resolve, reject) => {
    db.query(sqlStr, params, (err, ret) => {
      err ? next(err) : resolve(ret)
    })
  })
}
