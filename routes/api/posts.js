// 后台管理系统文章相关路由处理
const router = require('express').Router()
const postsCtrl = require('../../controllers/api/postsCtrl')
const { addPosts, articleBodyPicStorage }  = require('../../utils/multer')
const middle = require('../../middlewares/middlewares_oa')

// 配置路由表
router
  .get('/api/posts/list', middle.postsListVerification, postsCtrl.getPostsList)
  .post('/api/posts/add', addPosts.single('article_file'), middle.postsAddVerification, postsCtrl.addPosts)
  .post('/api/posts/add/articleBodyPic', articleBodyPicStorage.single('article_bodyPic'), postsCtrl.articleBodyPic)
  .delete('/api/posts/delete', middle.singleVerification, middle.deletePostVerification, postsCtrl.deletePosts)
  .delete('/api/posts/deleteBatch', middle.batchVerification, postsCtrl.deletePostsBatch)
  .get('/api/posts/info', middle.singleVerification, postsCtrl.getPostsInfo)
  .get('/api/posts/jumpEdit', middle.singleVerification, postsCtrl.jumpEdit)
  .put('/api/posts/edit', addPosts.single('article_file'), middle.postsEditVerification, postsCtrl.updatePosts)

// 表单验证
router
  .get('/api/posts/check_articleTitle', postsCtrl.checkArticleTitle)

module.exports = router
