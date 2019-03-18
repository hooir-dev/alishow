// 后台管理系统页面显示路由处理
const router = require('express').Router()
const adminCtrl = require('../controllers/adminCtrl')

// 路由表配置
router
  .get('/admin', adminCtrl.showAdmin) //=> 首页
  .get('/admin/login', adminCtrl.showLogin) //=> 登陆页面
  .get('/admin/posts', adminCtrl.showPosts) //=> 文章列表页面
  .get('/admin/posts/add', adminCtrl.showPostAdd) //=> 添加文章页面
  .get('/admin/posts/edit', adminCtrl.showPostEdit) //=> 编辑文章页面
  .get('/admin/categories', adminCtrl.showCategories) //=> 分类页面
  .get('/admin/comments', adminCtrl.showComments) //=> 评论列表页面
  .get('/admin/users', adminCtrl.showUsers) //=> 用户列表页面
  .get('/admin/menus', adminCtrl.showMenus) //=> 导航菜单列表页面
  .get('/admin/slides', adminCtrl.showSlides) //=> 轮播图列表页面
  .get('/admin/settings', adminCtrl.showSettings) //=> 网站设置列表页面
  .get('/admin/profile', adminCtrl.showProfile) //=> 个人中心页面
  .get('/admin/passwordReset', adminCtrl.showPasswordReset) //=> 修改密码页面

module.exports = router
