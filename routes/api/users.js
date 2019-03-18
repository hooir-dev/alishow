// 后台管理系统用户相关路由处理
const router = require('express').Router()
const usersCtrl = require('../../controllers/api/usersCtrl')
const middle = require('../../middlewares/middlewares_oa')

// 路由表配置
router
  .post('/admin/login', middle.usersLoginVerification, usersCtrl.userLogin)
  .get('/admin/logout', usersCtrl.userLogout)
  .get('/api/users/list', middle.usersListVerification, usersCtrl.getUsersList)
  .post('/api/users/add', middle.usersAddVerification, usersCtrl.addUser)
  .delete('/api/users/delete', middle.singleVerification, usersCtrl.deleteUser)
  .delete('/api/users/deleteBatch', middle.batchVerification, usersCtrl.deleteUsersBatch)
  .put('/api/users/changeState', middle.singleVerification, middle.usersStateVerification, usersCtrl.changeUserState)
  .get('/api/users/info', middle.singleVerification, usersCtrl.getUserInfo)
  .put('/api/users/updateInfo', middle.usersEditVerification, usersCtrl.updateUserInfo)

// 表单验证路由配置
router
  .get('/api/users/check_email', usersCtrl.checkEmail)
  .get('/api/users/check_nickname', usersCtrl.checkNickname)

module.exports = router
