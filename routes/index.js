// 普通用户端路由处理
const router = require('express').Router()
const indexCtrl = require('../controllers/indexCtrl')

// 路由表配置
router
  .get('/', indexCtrl.showIndex)
  .get('/posts', indexCtrl.showPosts)
  .get('/posts/detail', indexCtrl.showDetail)

module.exports = router
