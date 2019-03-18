// 后台管理系统图片轮播相关路由处理
const router = require('express').Router()
const slidesCtrl = require('../../controllers/api/sildesCtrl')
const middle = require('../../middlewares/middlewares_oa')
const { slidesAddStorage } = require('../../utils/multer')

// 路由表配置
router
  .get('/api/slides/list', slidesCtrl.getSlidesList)
  .post('/api/slides/add', slidesAddStorage.single('pic_url'), middle.addSlidesVerification, slidesCtrl.addSlide)
  .delete('/api/slides/delete', middle.singleVerification, slidesCtrl.deleteSlide)
  .delete('/api/slides/deleteBatch', middle.batchVerification, slidesCtrl.deleteSlideBatch)

module.exports = router
