// routes/api/comments.js 文件的 controllers
const cmtModel = require('../../models/api/commentsModel')

// 获取评论列表
exports.getCommentsList = async (req, res, next) => {
  let { currentPage, currentSize, state } = req.query

  currentPage = currentPage ? currentPage : 1
  currentSize = currentSize ? currentSize : 10
  state = state ? state : ''

  const countResult = await cmtModel.getCommentsCount(state, next)
  const totalPage = Math.ceil(countResult[0].count / currentSize)

  const result = await cmtModel.getCommentsList((currentPage - 1) * 10, currentSize, state, next)
  res.send({
    data: {
      data: result,
      totalPage
    },
    meta: {
      status: 200,
      message: '获取评论列表成功'
    }
  })
}

// 删除一条评论
exports.deleteCommentById = async (req, res, next) => {
  const { id } = req.body

  await cmtModel.deleteCommentById(id, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除评论成功'
    }
  })
}

// 批量删除评论
exports.deleteCommentBatch = async (req, res, next) => {
  const { ids } = req.body
  const delAll = ids.split(',')

  await cmtModel.deleteCommentById(delAll, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '批量删除评论成功'
    }
  })
}

// 驳回一条评论
exports.refuseComment = async (req, res, next) => {
  const { id } = req.body

  await cmtModel.refuseCommentById(id, next)
  res.send({
    data: {},
    meta: {
      status: 203,
      message: '驳回评论成功'
    }
  })
}

// 批量驳回评论
exports.refuseCommentBatch = async (req, res, next) => {
  const { ids } = req.body
  const refuseAll = ids.split(',')

  await cmtModel.refuseCommentById(refuseAll, next)
  res.send({
    data: {},
    meta: {
      status: 203,
      message: '批量驳回评论成功'
    }
  })
}

// 批准一条评论
exports.approvalComment = async (req, res, next) => {
  const { id } = req.body

  await cmtModel.approvalCommentById(id, next)
  res.send({
    data: {},
    meta: {
      status: 203,
      message: '批准评论成功'
    }
  })
}

// 批量批准评论
exports.approvalCommentBatch = async (req, res, next) => {
  const { ids } = req.body
  const approvalAll = ids.split(',')

  await cmtModel.approvalCommentById(approvalAll, next)
  res.send({
    data: {},
    meta: {
      status: 203,
      message: '批量批准成功'
    }
  })
}
