// 后台管理系统评论相关路由处理
const router = require('express').Router()
const cmtCtrl = require('../../controllers/api/commentsCtrl')
const middle = require('../../middlewares/middlewares_oa')

// 配置路由表
router
  .get('/api/comments/list', middle.commentListVerification, cmtCtrl.getCommentsList)
  .delete('/api/comments/delete', middle.singleVerification, cmtCtrl.deleteCommentById)
  .delete('/api/comments/deleteBatch', middle.batchVerification, cmtCtrl.deleteCommentBatch)
  .put('/api/comments/refuse', middle.singleVerification, cmtCtrl.refuseComment)
  .put('/api/comments/refuseBatch', middle.batchVerification, cmtCtrl.refuseCommentBatch)
  .put('/api/comments/approval', middle.singleVerification, cmtCtrl.approvalComment)
  .put('/api/comments/approvalBatch', middle.batchVerification, cmtCtrl.approvalCommentBatch)


module.exports = router
