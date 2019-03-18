const express = require('express')
const path = require('path')
const glob = require('glob')
const errorhandler = require('errorhandler')
const notifier = require('node-notifier')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const config = require('./config')
const appCtrl = require('./controllers/appCtrl')
const app = express()

// 登陆日志记录
app.post('/admin/login', appCtrl.visitLog)

// 页面日志记录

// api 日志记录

// 配置 session 空间
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: require('./utils/session')
}))

// 配置 express-art-template
app.engine('html', require('express-art-template'))
app.set('view options', { debug: process.env.NODE_ENV !== 'production' })

// 配置解析请求体
app.use(express.urlencoded())

// 配置解析 cookie
app.use(cookieParser())

// 统一处理静态资源
app.use('/public', express.static(path.join(__dirname, './public/')))

// 后台管理系统的登陆验证
app.use('/admin', (req, res, next) => appCtrl.loginHandler(req, res, next, app))

// 后台管理系统 API 的登陆验证和权限验证
app.use('/api', appCtrl.apiHandler)

// users 模块的权限验证
app.use('/api/users', appCtrl.usersRight)

// 统一自动化挂载路由
glob.sync("./routes/**/*.js").forEach(item => typeof require(item) === 'function' && app.use(require(item)))

// 统一错误处理
app.use(appCtrl.errorHandler)
// if (config.dev) {
//   app.use(errorhandler({log: errorNotification}))
//   function errorNotification (err, str, req) {
//     const title = 'Error in ' + req.method + ' ' + req.url

//     notifier.notify({
//       title: title,
//       message: str
//     })
//   }
// } else {
//   app.use(appCtrl.errorHandler)
// }

app.listen(8080, () => {
  console.log('Server running at http://127.0.0.1:8080/')
})
