// routes/api/users.js 文件的 controllers
const usersModel = require('../../models/api/usersModel')
const md5 = require('../../utils/md5')

// 用户登陆
exports.userLogin = async (req, res, next) => {
  const { admin_email, admin_pwd, remember } = req.body

  const result = await usersModel.getUserInfoByEmail(admin_email, next)
  // 验证不对
  if (!result.length || result[0].admin_pwd !== md5(admin_pwd)) return res.send({
    data: {},
    meta: {
      status: 203,
      message: '用户名密码错误'
    }
  })

  // 用户状态判断
  if (result[0].admin_state !== '激活') return res.send({
    data: {},
    meta: {
      status: 205,
      message: '登陆失败，该用户已被禁用，请联系管理员'
    }
  })

  // 登陆状态保持
  req.session.user = result[0]

  // 免密登陆操作
  if (remember) {
    const userInfo = JSON.stringify({
      admin_email: result[0].admin_email,
      admin_pwd: result[0].admin_pwd
    })
    res.cookie('rememberme', userInfo, {
      maxAge: 1000 * 60 * 60
    })
  }

  res.send({
    data: {},
    meta: {
      status: 200,
      message: '登陆成功'
    }
  })
}

// 用户登出
exports.userLogout = (req, res) => {
  delete req.session.user
  res.clearCookie('rememberme')
  res.redirect('/admin/login')
}

// 获取所有用户列表
exports.getUsersList = async (req, res, next) => {
  const {currentPage, currentSize, search} = req.query

  const usersCount = await usersModel.getUserCount(search ? search : '', next)
  const totalPage = Math.ceil(usersCount[0].count / (currentSize ? currentSize : 10))

  let result = await usersModel.getUsersList(currentPage ? (currentPage - 1) * 10 : 1, currentSize ? currentSize : 10, search ? search : '', next)
  result = result.filter(item => item.admin_id !== 17)

  if (search !== '' && result.length === 0) return res.send({
    data: {
      totalPage: 1,
      data: []
    },
    meta: {
      status: 209,
      message: '您搜索的邮箱不存在！'
    }
  })

  res.send({
    data: {
      data: result,
      totalPage
    },
    meta: {
      status: 200,
      message: '获取用户列表成功'
    }
  })
}

// 添加用户
exports.addUser = async (req, res, next) => {
  const { admin_email, admin_slug, admin_nickname, admin_pwd } = req.body

  // 验证邮箱重复
  const emailResult = await usersModel.getUserInfoByEmail(admin_email, next)
  if (emailResult.length) return res.send({
    data: {
      type: 'admin_email'
    },
    meta: {
      status: 209,
      message: '添加失败，用户邮箱已存在！'
    }
  })

  // 验证昵称重复
  const nicknameResult = await usersModel.getUsenInfoByNickname(admin_nickname, next)
  if (nicknameResult.length) return res.send({
    data: {
      type: 'admin_nickname'
    },
    meta: {
      status: 209,
      message: '添加失败，用户昵称已存在！'
    }
  })

  // 加入数据库
  await usersModel.addUser(admin_email, admin_slug, admin_nickname, md5(admin_pwd), next)

  // 给出响应
  res.send({
    data: {},
    meta: {
      status: 201,
      message: '创建用户成功'
    }
  })
}

// 删除用户
exports.deleteUser = async (req, res, next) => {
  const { id } = req.body

  // 检测是否是删除 admin 用户
  if (id - 0 === 17) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '超管用户不能被删除'
    }
  })

  await usersModel.deleteUsersByIds(id, next)

  // 给出响应
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除用户成功'
    }
  })
}

// 批量删除用户
exports.deleteUsersBatch = async (req, res, next) => {
  const { ids } = req.body
  const delAll = ids.split(',')

  // 是否包含超管 id
  const adminFlag = delAll.some(item => item - 0 === 17)
  if (adminFlag) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '您所删除的用户中包含超管'
    }
  })

  // 删除数据
  await usersModel.deleteUsersByIds(delAll, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除用户成功'
    }
  })
}

// 更改用户状态
exports.changeUserState = async (req, res, next) => {
  const { state, id } = req.body

  await usersModel.changeUserStateById(state === 'true' ? '激活' : '禁用', id, next)

  return res.send({
    data: {},
    meta: {
      status: 200,
      message: '修改用户状态成功'
    }
  })
}

// 根据 id 获取用户信息
exports.getUserInfo = async (req, res, next) => {
  const { id } = req.query

  const result = await usersModel.getUserInfoById(id, next)
  if (!result.length) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '已经没有该用户了，请刷新后重试'
    }
  })

  res.send({
    data: {
      data: result[0]
    },
    meta: {
      status: 200,
      message: '获取用户信息成功'
    }
  })
}

// 编辑用户信息
exports.updateUserInfo = async (req, res, next) => {
  const { admin_email, admin_nickname, admin_slug, admin_id, admin_tel, admin_age, admin_gender } = req.body

  // admin 检验
  if (admin_id - 0 === 17) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '超级管理员信息不能被编辑'
    }
  })

  // 该用户是否存在
  const idResult = await usersModel.getUserInfoById(admin_id, next)
  if (idResult.length === 0) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '该用户已经不存在，请刷新后重试'
    }
  })

  // 检查昵称是否被占用
  let nicknameResult = null
  if (idResult[0].admin_nickname !== admin_nickname) nicknameResult = await usersModel.getUsenInfoByNickname(admin_nickname, next)
  if (nicknameResult && nicknameResult.length !== 0) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '修改失败，该昵称已经被占用'
    }
  })

  // 添加到数据库
  await usersModel.changeUserInfoById(admin_nickname, admin_slug, admin_tel ? admin_tel : null, admin_age ? admin_age : null, admin_gender ? admin_gender : null, admin_id, next)

  // 给出响应
  res.send({
    data: {},
    meta: {
      status: 200,
      message: admin_email ? '用户邮箱不能被更改，其余信息已经更新' : '编辑用户成功'
    }
  })
}

// 邮箱表单验证
exports.checkEmail = async (req, res, next) => {
  const {admin_email} = req.query
  const result = await usersModel.getUserInfoByEmail(admin_email, next)
  res.send(result.length === 0)
}

// 昵称表单验证
exports.checkNickname = async (req, res, next) => {
  const {admin_nickname} = req.query
  const result = await usersModel.getUsenInfoByNickname(admin_nickname, next)
  res.send(result.length === 0)
}
