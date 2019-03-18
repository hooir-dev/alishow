// controllers/api/categoriesCtrl.js 文件的 model
const query = require('../../utils/query')

// 获取所有分类列表
exports.getCategoriesList = next => query('SELECT * FROM `ali_cate` ORDER BY `cate_id` ASC', [], next)

// 根据分类名称获取数据
exports.getCategoriesByName = (name, next) => query('SELECT * FROM `ali_cate` WHERE `cate_name`=?', [name], next)

// 根据分类别名获取数据
exports.getCategoriesBySlug = (slug, next) => query('SELECT * FROM `ali_cate` WHERE `cate_slug`=?', [slug], next)

// 根据分类 id 获取数据
exports.getCategoriesById = (id, next) => query('SELECT * FROM `ali_cate` WHERE `cate_id`=?', [id], next)

// 添加分类
exports.addCategories = (name, slug, next) => query('INSERT INTO `ali_cate` SET `cate_name`=?, `cate_slug`=?', [name, slug], next)

// 获取分类数量
exports.getCategoriesCount = next => query('SELECT COUNT(cate_id) `count` FROM `ali_cate`', [], next)

// 删除一个分类
exports.deleteCategoriesByIds = (ids, next) => query('DELETE FROM `ali_cate` WHERE `cate_id` IN(?)', [ids], next)

// 编辑分类信息
exports.changeCategoriesInfoById = (slug, id, next) => query('UPDATE `ali_cate` SET `cate_slug`=? WHERE `cate_id`=?', [slug, id], next)
