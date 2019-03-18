// controllers/adminCtrl.js 文件的 model
const query = require('../../utils/query')

// 获取文章总数量
exports.getArticleCount = next => query('SELECT COUNT(*) `count` FROM `ali_article`', [], next)

// 获取文章草稿数量
exports.getArticleDraftCount = next => query('SELECT COUNT(*) `count` FROM `ali_article` WHERE `article_status`=?', ['草稿'], next)

// 获取分类数量
exports.getCategoriesCount = next => query('SELECT COUNT(*) `count` FROM `ali_cate`', [], next)

// 获取评论总数量
exports.getCommentsCount = next => query('SELECT COUNT(*) `count` FROM `ali_comment`', [], next)

// 获取评论待审核数量
exports.getCommentsUnratifiedCount = next => query('SELECT COUNT(*) `count` FROM `ali_comment` WHERE `cmt_state`=?', ['未批准'], next)
