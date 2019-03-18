// app.js 文件的 controllers
const { getUserInfoByEmail } = require('../models/api/usersModel')
const md5 = require('../utils/md5')
const config = require('../config')
const fs = require('fs')
const url = require('url')

// 统一错误处理
exports.errorHandler = (err, req, res, next) => {
  res.status(500).send({
    data: {},
    meta: {
      code: 500,
      message: 'Internal Server Error',
      error: err.message
    }
  })
}

// 页面的登陆验证
exports.loginHandler = async (req, res, next, app) => {
  // 登陆直接通过
  if (req.originalUrl === '/admin/login') return next()

  // 其余验证 session
  const sessionUser = req.session.user
  if (sessionUser) {
    app.locals.sessionUser = sessionUser
    return next()
  }

  // 没有 session 验证 cookie
  let userInfo = req.cookies.rememberme
  if (!userInfo) return res.redirect('/admin/login')
  userInfo = JSON.parse(userInfo)
  const result = await getUserInfoByEmail(userInfo.admin_email, next)
  if (!result || result[0].admin_pwd !== userInfo.admin_pwd) return res.redirect('/admin/login')
  app.locals.sessionUser = result[0]
  req.session.user = result[0]
  res.cookie('rememberme', JSON.stringify(userInfo), {
    maxAge: 1000 * 60 * 60
  })
  next()
}

// api 接口的登陆验证
exports.apiHandler = (req, res, next) => {
  if (!req.session.user) return res.status(403).send({
    data: {},
    meta: {
      status: 403,
      message: '登陆过期，请重新登陆！'
    }
  })

  next()
}

// 用户模块的权限验证
exports.usersRight = (req, res, next) => {
  const {admin_id} = req.session.user
  if (admin_id !== 17) return res.status(401).send({
    data: {},
    meta: {
      status: 401,
      message: '您没有权限进行该操作！'
    }
  })

  next()
}

// 记录访问日志
exports.visitLog = (req, res, next) => {
  const countJson = fs.readFileSync('./count/count.json', 'utf8')
  const visitCount = JSON.parse(countJson)

  const str = `[${new Date()}][visit] - visit - ${req.headers.host} - - "${req.method} / HTTP/${req.httpVersion}" "${req.headers['user-agent']}" \n\t\t...... { "count": "${visitCount.count.visit}" }\n\t\t...... { "cookie": "${req.headers.cookie}" }\n\t\t...... { "path": "${req.url}" }\n`
  fs.appendFile(`./logs/visit/${req.headers.host}.txt`, str, 'utf8', err => {
    if (err) return next(err)

    visitCount.count.visit++
    fs.writeFile('./count/count.json', JSON.stringify(visitCount), 'utf8', err => {
      if (err) return next(err)
    })

    next()
  })
}
