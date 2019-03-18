// routes/api/posts.js 文件的 controllers
const postsModel = require('../../models/api/postsModel')

// 获取所有文章列表
exports.getPostsList = async (req, res, next) => {
  let { currentPage, currentSize, category, status } = req.query
  currentPage = currentPage ? (currentPage - 1) * 10 : 1
  currentSize = currentSize ? currentSize : 10
  category = category ? category : ''
  status = status ? status : ''

  // 按照需求查询文章总数
  const countResult = await postsModel.getPostsCount(category, status, next)
  const totalPage = Math.ceil(countResult[0].count / currentSize)

  const result = await postsModel.getPostsList(currentPage, currentSize, category, status, next)
  res.send({
    data: {
      data: result,
      totalPage,
    },
    meta: {
      status: 200,
      message: '获取文章列表成功'
    }
  })
}

// 新增文章
exports.addPosts = async (req, res, next) => {
  const {article_title, article_slug, article_cateid, article_addtime, article_status, article_body} = req.body
  const {admin_id: article_adminid} = req.session.user
  let article_filename = ''
  if (req.file) {
    const {filename} = req.file
    article_filename = '/public/uploads/postsArticleShowPic/' + filename
  }

  // 存储到数据库
  const article = {
    article_title,
    article_slug: article_slug ? article_slug : null,
    article_cateid,
    article_adminid,
    article_addtime,
    article_status,
    article_body,
    article_file: article_filename ? article_filename : null
  }

  await postsModel.addPost(article, next)
  res.send({
    data: {},
    meta: {
      status: 200,
      message: '添加文章成功'
    }
  })
}

// 文章的内容文件处理
exports.articleBodyPic = async (req, res, next) => {
  res.send({
    errno: 0,
    data: ['/public/uploads/postsArticleBodyPic/' + req.file.filename]
  })
}

// 删除一篇文章
exports.deletePosts = async (req, res, next) => {
  const { id } = req.body

  // 删除文章
  await postsModel.deletePostsByIds(id, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除文章成功'
    }
  })
}

// 批量删除文章
exports.deletePostsBatch = async (req, res, next) => {
  const { ids } = req.body
  const { admin_id } = req.session.user
  const delAll = ids.split(',')

  // 判断是不是全是自己的 admin_id
  if (admin_id !== 17) {
    const countResult = await postsModel.getAdminIdByIdsCount(delAll, admin_id, next)
    if (countResult[0].count !== delAll.length) return res.send({
      data: {},
      meta: {
        status: 209,
        message: '删除失败，您删除的文章中包含别人的文章，请重新选择'
      }
    })
  }

  // 直接删除
  await postsModel.deletePostsByIds(delAll, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '批量删除文章成功'
    }
  })
}

// 准备跳转编辑文章页面的验证
exports.jumpEdit = async (req, res, next) => {
  const { id } = req.query
  const { admin_id } = req.session.user

  // 按照 id 查询文章
  const result = await postsModel.getPostById(id, next)

  // 判断文章是否存在
  if (result.length === 0) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '该文章已经被删除，请刷新后重试！'
    }
  })

  // 判断文章内容中的 adminid 和 当前用户 admin_id 是否一致
  if ((result[0].article_adminid - 0) !== (admin_id - 0)) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '你不能编辑别人的文章！'
    }
  })

  // 返回可以编辑
  res.send({
    data: {},
    meta: {
      status: 200,
      message: '可以编辑文章'
    }
  })
}

// 编辑文章
exports.updatePosts = async (req, res, next) => {
  const {article_title, article_slug, article_cateid, article_addtime, article_status, article_body, article_id} = req.body
  let article_filename = ''
  if (req.file) {
    const {filename} = req.file
    article_filename = '/public/uploads/postsArticleShowPic/' + filename
  }

  const idResult = await postsModel.getPostById(article_id, next)

  // 存储到数据库
  const article = {}
  if (idResult[0].article_title !== article_title) article.article_title = article_title
  if (idResult[0].article_slug !== article_slug) article.article_slug = article_slug
  if (idResult[0].article_body !== article_body) article.article_body = article_body
  if ((idResult[0].article_cateid - 0) !== (article_cateid - 0)) article.article_cateid = article_cateid
  if (idResult[0].article_status !== article_status) article.article_status = article_status
  if (article_filename) article.article_file = article_filename

  // 执行存储
  await postsModel.updatePost(article, article_id, next)
  res.send({
    data: {},
    meta: {
      status: 200,
      message: article_addtime ? '编辑文章成功，文章创建时间不能被修改，其余信息已经更改' : '编辑文章成功'
    }
  })
}

// 根据 id 获取文章信息
exports.getPostsInfo = async (req, res, next) => {
  const { id } = req.query

  // 获取文章信息
  const result = await postsModel.getPostById(id, next)
  if (!result.length) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '获取文章信息失败，该文章已经被删除！'
    }
  })

  res.send({
    data: {
      data: result[0]
    },
    meta: {
      status: 200,
      message: '获取文章信息成功'
    }
  })
}

// 文章名称表单验证
exports.checkArticleTitle = async (req, res, next) => {
  const { article_title } = req.query
  const result = await postsModel.getArticleByTitle(article_title, next)
  res.send(!result.length)
}
