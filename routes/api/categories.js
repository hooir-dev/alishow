// 后台管理系统分类相关路由处理
const router = require('express').Router()
const cateCtrl = require('../../controllers/api/categoriesCtrl')
const middle = require('../../middlewares/middlewares_oa')

// 配置路由表
router
  .get('/api/categories/list', cateCtrl.getCategoriesList)
  .post('/api/categories/add', middle.addCateVerification, cateCtrl.addCategories)
  .delete('/api/categories/delete', middle.deleteCateVerification, middle.singleVerification, cateCtrl.deleteCategories)
  .delete('/api/categories/deleteBatch', middle.deleteCateVerification, middle.batchVerification, cateCtrl.deleteCategoriesBatch)
  .get('/api/categories/info', middle.singleVerification, cateCtrl.getCategoriesInfo)
  .put('/api/categories/edit', middle.editCateVerification, cateCtrl.updateCategoryInfo)

// 表单验证路由配置
router
  .get('/api/categories/check_name', cateCtrl.checkName)
  .get('/api/categories/check_slug', cateCtrl.checkSlug)

module.exports = router
