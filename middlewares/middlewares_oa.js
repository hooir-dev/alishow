// 后台管理系统公用中间件
const reg = require('../utils/regexp')
const usersModel = require('../models/api/usersModel')
const postsModel = require('../models/api/postsModel')
const cateModel = require('../models/api/categoriesModel')
const categoriesModel = require('../models/api/categoriesModel')
const fs = require('fs')

/* public start */
// 单一数据的操作（删除/驳回/批准）参数验证
exports.singleVerification = (req, res, next) => {
  const id = req.body.id || req.query.id
  if (!reg.numberReg.test(id)) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}

// 批量数据的操作（删除/驳回/批准）参数验证
exports.batchVerification = (req, res, next) => {
  const { ids } = req.body
  const delAll = ids.split(',')

  const flag = delAll.every(item => item - 0)
  if (!flag) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}
/* public end */

/***************************************************************/

/* users start */
// 用户改变状态的状态验证
exports.usersStateVerification = (req, res, next) => {
  const { state } = req.body

  if (!reg.booReg.test(state)) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}

// 用户登陆的参数验证
exports.usersLoginVerification = (req, res, next) => {
  const { admin_email, admin_pwd } = req.body

  if (!reg.emailReg.test(admin_email) || !reg.pwdReg.test(admin_pwd)) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}

// 获取用户列表的参数验证
exports.usersListVerification = (req, res, next) => {
  const {currentPage, currentSize, search} = req.query

  if (!((currentPage === undefined || currentPage === '' || reg.numberReg.test(currentPage)) && (currentSize === undefined || currentSize === '' || reg.numberReg.test(currentSize)) && (search === undefined || typeof search === 'string'))) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}

// 添加用户的参数验证
exports.usersAddVerification = (req, res, next) => {
  const { admin_email, admin_slug, admin_nickname, admin_pwd } = req.body

  if (!(reg.emailReg.test(admin_email) && reg.pwdReg.test(admin_pwd) && reg.nameReg.test(admin_nickname) && reg.nameReg.test(admin_slug))) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}

// 编辑用户的参数验证
exports.usersEditVerification = (req, res, next) => {
  const { admin_nickname, admin_slug, admin_id, admin_tel, admin_age, admin_gender } = req.body

  if (!(reg.nameReg.test(admin_nickname) && reg.nameReg.test(admin_slug) && reg.numberReg.test(admin_id) && (admin_tel === undefined || admin_tel === '' || reg.phoneReg.test(admin_tel)) && (admin_age === undefined || admin_age === '' || reg.ageReg.test(admin_age)) && (admin_gender === undefined || admin_gender === '' || reg.genderReg.test(admin_gender)))) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}

/* users end */

/***************************************************************/

/* category start */
// 添加分类的参数验证
exports.addCateVerification = async (req, res, next) => {
  const {cate_name, cate_slug} = req.body
  if (!reg.nameReg.test(cate_name) || !reg.nameReg.test(cate_slug)) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  // 名称和别名校验
  const nameResult = await cateModel.getCategoriesByName(cate_name, next)
  if (nameResult.length) return res.send({
    data: {
      type: 'cate_name'
    },
    meta: {
      status: 209,
      message: '修改失败，该分类名称已经被占用'
    }
  })

  const slugResult = await cateModel.getCategoriesBySlug(cate_slug, next)
  if (slugResult.length) return res.send({
    data: {
      type: 'cate_slug'
    },
    meta: {
      status: 209,
      message: '修改失败，该分类别名已经被占用'
    }
  })

  next()
}

// 删除分类的权限验证
exports.deleteCateVerification = (req, res, next) => {
  if (req.session.user.admin_id !== 17) return res.status(401).send({
    data: {},
    meta: {
      status: 401,
      message: '没有权限执行该操作，请联系超管！'
    }
  })

  next()
}

// 编辑分类的参数验证
exports.editCateVerification = (req, res, next) => {
  const { cate_slug, cate_id } = req.body

  if (!reg.nameReg.test(cate_slug) || !reg.numberReg.test(cate_id)) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  next()
}
/* category end */

/***************************************************************/

/* posts start */
// 获取文章列表的参数验证
exports.postsListVerification = async (req, res, next) => {
  const { currentPage, currentSize, category, status } = req.query

  if (!(((currentPage === undefined || currentPage === '') || reg.numberReg.test(currentPage)) && ((currentSize === undefined || currentSize === '') || reg.numberReg.test(currentSize)) && ((category === undefined || category === '') || typeof(category) === 'string') && ((status === undefined || status === '') || reg.postsStatusReg.test(status)))) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  // 验证是否有该分类名称
  let cateResult = null
  category && (cateResult = await categoriesModel.getCategoriesByName(category, next))
  if (cateResult && cateResult.length === 0) return res.send({
    data: {
      data: [],
      totalPage: 1
    },
    meta: {
      status: 209,
      message: '获取文章列表失败，没有该分类信息'
    }
  })

  next()
}

// 新增文章的参数验证
exports.postsAddVerification = async (req, res, next) => {
  const { article_title, article_slug, article_cateid, article_addtime, article_status } = req.body

  if (!((typeof article_title === 'string' && article_title.length >= 1) && ((article_slug === undefined || typeof article_slug === 'string') || reg.nameReg.test(article_slug)) && reg.numberReg.test(article_cateid) && reg.timeReg.test(article_addtime) && reg.postsStatusReg.test(article_status))) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.status(400).send({
      data: {},
      meta: {
        status: 400,
        message: '参数有误，请检查'
      }
    })
  }

  // 验证分类是否存在
  const cateResult = await categoriesModel.getCategoriesById(article_cateid, next)
  if (!cateResult.length) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '添加文章失败，该分类不存在或已经被删除，请更换后再次尝试！'
      }
    })
  }

  next()
}

// 删除一篇文章的参数验证
exports.deletePostVerification = async (req, res, next) => {
  const { id } = req.body
  const { admin_id } = req.session.user

  const result = await postsModel.getPostById(id, next)
  // 判断文章是否存在
  if (!result.length) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '该文章已经被删除，请刷新后重试'
    }
  })

  // 判断删除的是别人的文章
  if (admin_id !== 17 && (admin_id - 0) !== (result[0].article_adminid - 0)) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '删除失败，你不能删除别人的文章'
    }
  })

  next()
}

// 编辑文章的参数验证
exports.postsEditVerification = async (req, res, next) => {
  const {article_title, article_slug, article_cateid, article_status, article_id} = req.body
  const {admin_id} = req.session.user

  if (!((typeof article_title === 'string' && article_title.length >= 1) && ((article_slug === undefined || typeof article_slug === 'string') || reg.nameReg.test(article_slug)) && reg.numberReg.test(article_cateid) && reg.postsStatusReg.test(article_status) && reg.numberReg.test(article_id))) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.status(400).send({
      data: {},
      meta: {
        status: 400,
        message: '参数有误，请检查'
      }
    })
  }

  const idResult = await postsModel.getPostById(article_id, next)
  // 判断文章是否存在
  if (!idResult.length) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '编辑失败，该文章已经被删除'
      }
    })
  }

  // 判断编辑的是否是别人的文章
  if (admin_id !== idResult[0].article_adminid) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '编辑文章失败，您不能编辑别人的文章'
      }
    })
  }

  // 验证 title 是否存在
  let titleResult = null
  if (idResult[0].article_title !== article_title) {
    titleResult = await postsModel.getArticleByTitle(article_title, next)
  }
  if (titleResult && titleResult.length) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '修改文章失败，该标题已经存在'
      }
    })
  }

  // 验证分类是否存在
  const cateResult = await categoriesModel.getCategoriesById(article_cateid, next)
  if (cateResult.length === 0) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '添加文章失败，该分类不存在或已经被删除，请更换后再次尝试'
      }
    })
  }

  next()
}
/* posts end */

/***************************************************************/

/* comment start */
// 获取评论列表的参数验证
exports.commentListVerification = (req, res, next) => {
  const { currentPage, currentSize, state } = req.query

  if (!(((currentPage === undefined || currentPage === '') || reg.numberReg.test(currentPage)) && ((currentSize === undefined || currentSize === '') || reg.numberReg.test(currentSize)) && ((state === undefined || state === '') || reg.commentStateReg.test(state)))) return res.status(400).send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查！'
    }
  })

  next()
}
/* comment end */

/***************************************************************/

/* profile start */
// 修改用户信息的参数验证
exports.userInfoVerification = async (req, res, next) => {
  const { admin_slug, admin_nickname, admin_sign } = req.body
  if (!((admin_slug === undefined || admin_slug === '' || reg.nameReg.test(admin_slug)) && reg.nameReg.test(admin_nickname) && (admin_sign === undefined || admin_sign === '' || /^.{0,200}$/.test(admin_sign)))) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.status(400).send({
      data: {},
      meta: {
        status: 400,
        message: '参数有误，请检查！'
      }
    })
  }

  let result = null
  if (admin_nickname !== req.session.user.admin_nickname) {
    result = await usersModel.getUsenInfoByNickname(admin_nickname, next)
  }
  if (result && result.length) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '修改失败，该用户名已经被占用！'
      }
    })
  }

  next()
}

// 修改用户密码的参数验证
exports.userPwdResetVerification = async (req, res, next) => {
  const { admin_pwd, admin_npwd, admin_rnpwd } = req.body
  if (!reg.pwdReg.test(admin_pwd) || !reg.pwdReg.test(admin_npwd) || !reg.pwdReg.test(admin_rnpwd)) return res.status(400),send({
    data: {},
    meta: {
      status: 400,
      message: '参数有误，请检查'
    }
  })

  if (admin_npwd !== admin_rnpwd) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '修改失败，两次密码不一致！'
    }
  })

  next()
}
/* profile end */

/***************************************************************/

/* slids start */
// 添加轮播图的参数验证
exports.addSlidesVerification = async (req, res, next) => {
  const { pic_text, pic_link } = req.body

  if (!req.file || !pic_text || !pic_link) {
    req.file && fs.unlink(req.file.path, () => {})
    return res.status(400).send({
      data: {},
      meta: {
        status: 400,
        message: '参数有误，请检查'
      }
    })
  }

  next()
}
/* slids end */
