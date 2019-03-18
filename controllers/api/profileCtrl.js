// routes/api/profile.js 文件的 controllers
const profileModel = require('../../models/api/profileModel')
const userModel = require('../../models/api/usersModel')
const md5 = require('../../utils/md5')

// 获取用户信息
exports.getUserInfo = async (req, res, next) => {
  const {user: info} = req.session
  res.send({
    data: {
      data: info
    },
    meta: {
      status: 200,
      message: '获取用户信息成功'
    }
  })
}

// 更新用户信息
exports.updateUserInfo = async (req, res, next) => {
  const { admin_slug, admin_nickname, admin_sign, admin_email } = req.body
  const { file } = req
  const { admin_id } = req.session.user

  const userInfo = {
    admin_nickname
  }
  admin_slug ? userInfo.admin_slug = admin_slug : ''
  admin_sign ? userInfo.admin_sign = admin_sign : ''
  file ? userInfo.admin_pic = '/public/uploads/profilePic/' + file.filename : ''

  // 更新信息
  await profileModel.updateUserInfo(userInfo, admin_id, next)
  const result = await userModel.getUserInfoById(admin_id, next)
  req.session.user = result[0]
  res.send({
    data: {
      data: result[0]
    },
    meta: {
      status: 203,
      message: admin_email ? '用户邮箱不可被更改，其余信息已经更新' : '修改用户信息成功'
    }
  })
}

// 更新用户密码
exports.resetUserPwd = async (req, res, next) => {
  const { admin_pwd, admin_npwd } = req.body
  const { admin_pwd: admin_opwd, admin_id } = req.session.user

  if (md5(admin_pwd) !== admin_opwd) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '修改失败，原始密码错误'
    }
  })

  // 更改用户密码
  await profileModel.updateUserPwd(md5(admin_npwd), admin_id, next)
  res.send({
    data: {},
    meta: {
      status: 200,
      message: '更新用户密码成功'
    }
  })
}
