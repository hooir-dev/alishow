const crypto = require('crypto')

module.exports = str => {
  const hash = crypto.createHash('md5')

  hash.update(str)

  return hash.digest('hex')
}
