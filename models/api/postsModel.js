// controllers/api/postsCtrl.js 文件的 model
const query = require('../../utils/query')

// 获取文章信息列表
// SELECT aa.article_id, aa.article_title, ad.admin_nickname, ac.cate_name, aa.article_addtime, aa.article_status, ad.admin_id FROM `ali_article` aa INNER JOIN `ali_cate` ac ON aa.article_cateid=ac.cate_id INNER JOIN `ali_admin` ad ON aa.article_adminid=ad.admin_id WHERE `cate_name` LIKE '%%' AND `article_status` LIKE '%%'  ORDER BY `article_id` ASC LIMIT 0, 10
exports.getPostsList = (page, size, cate, state, next) => query('SELECT aa.article_id, aa.article_title, ad.admin_nickname, ac.cate_name, aa.article_addtime, aa.article_status, ad.admin_id FROM `ali_article` aa INNER JOIN `ali_cate` ac ON aa.article_cateid=ac.cate_id INNER JOIN `ali_admin` ad ON aa.article_adminid=ad.admin_id WHERE `cate_name` LIKE \'%' + cate + '%\' AND `article_status` LIKE \'%' + state + '%\'  ORDER BY `article_id` ASC LIMIT ' + page + ', ' + size, [], next)

// 获取文章总数
exports.getPostsCount = (cate, state, next) => query('SELECT COUNT(article_id) `count` FROM `ali_article` aa INNER JOIN `ali_cate` ac ON aa.article_cateid=ac.cate_id INNER JOIN `ali_admin` ad ON aa.article_adminid=ad.admin_id WHERE `cate_name` LIKE \'%' + cate + '%\' AND `article_status` LIKE \'%' + state + '%\'', [], next)

// 根据 id 获取文章
exports.getPostById = (id, next) => query('SELECT * FROM `ali_article` WHERE `article_id`=?', [id], next)

// 根据 id 删除文章
exports.deletePostsByIds = (ids, next) => query('DELETE FROM `ali_article` WHERE `article_id` IN(?)', [ids], next)

// 根据文章 id 获取用户 id 数量
exports.getAdminIdByIdsCount = (ids, adminid, next) => query('SELECT COUNT(*) count FROM `ali_article` WHERE `article_adminid`=? AND `article_id` IN (?)', [adminid, ids], next)

// 根据标题获取文章
exports.getArticleByTitle = (title, next) => query('SELECT * FROM `ali_article` WHERE `article_title`=?', [title], next)

// 添加文章到数据库
exports.addPost = (article, next) => query('INSERT INTO `ali_article` SET ?', [article], next)

// 根据 id 修改文章
exports.updatePost = (article, id, next) => query('UPDATE `ali_article` SET ? WHERE `article_id`=?', [article, id], next)
