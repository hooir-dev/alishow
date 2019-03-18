// 后台管理系统个人中心相关路由处理
const router = require('express').Router()
const profileCtrl = require('../../controllers/api/profileCtrl')
const middle = require('../../middlewares/middlewares_oa')
const { userAvatarStorage } = require('../../utils/multer')

// 路由表配置
router
  .get('/api/profile/info', profileCtrl.getUserInfo)
  .put('/api/profile/update', userAvatarStorage.single('userAvatar'), middle.userInfoVerification, profileCtrl.updateUserInfo)
  .put('/api/profile/reset', middle.userPwdResetVerification, profileCtrl.resetUserPwd)


module.exports = router
