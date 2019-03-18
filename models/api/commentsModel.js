// controllers/api/commentsCtrl.js 文件的 model
const query = require('../../utils/query')

// 获取评论列表
exports.getCommentsList = (page, size, state, next) => query('SELECT ac.cmt_id, ac.cmt_content, ac.cmt_addtime, ac.cmt_state, aa.article_title, am.member_nickname FROM `ali_comment` ac INNER JOIN `ali_member` am ON ac.cmt_memid=am.member_id INNER JOIN `ali_article` aa ON ac.cmt_articleid=aa.article_id WHERE `cmt_state` LIKE \'%' + state + '%\' ORDER BY `cmt_id` ASC LIMIT ' + page + ', ' + size, [], next)

// 获取评论总数
exports.getCommentsCount = (state, next) => query('SELECT COUNT(*) `count` FROM `ali_comment` ac INNER JOIN `ali_member` am ON ac.cmt_memid=am.member_id INNER JOIN `ali_article` aa ON ac.cmt_articleid=aa.article_id WHERE `cmt_state` LIKE \'%' + state + '%\'', [], next)

// 删除评论
exports.deleteCommentById = (ids, next) => query('DELETE FROM `ali_comment` WHERE `cmt_id` IN(?)', [ids], next)

// 驳回评论
exports.refuseCommentById = (ids, next) => query('UPDATE `ali_comment` SET `cmt_state`=\'未批准\' WHERE `cmt_id` IN(?)', [ids], next)

// 批准评论
exports.approvalCommentById = (ids, next) => query('UPDATE `ali_comment` SET `cmt_state`=\'已批准\' WHERE `cmt_id` IN(?)', [ids], next)



