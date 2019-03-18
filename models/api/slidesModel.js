// controllers/api/usersCtrl.js 文件的 model
const query = require('../../utils/query')

// 获取轮播图列表
exports.getSlidesList = next => query('SELECT * FROM `ali_pic` ORDER BY `pic_id` ASC', [], next)

// 添加一个轮播图
exports.addSlide = (url, text, link, next) => query('INSERT INTO `ali_pic` SET `pic_url`=?, `pic_text`=?, `pic_link`=?', [url, text, link], next)

// 获取轮播图数量
exports.getSlidesCount = next => query('SELECT COUNT(*) `count` FROM `ali_pic` ORDER BY `pic_id` ASC', [], next)

// 删除一个轮播图
exports.deleteSlidesByIds = (ids, next) => query('DELETE FROM `ali_pic` WHERE `pic_id` IN(?)', [ids], next)
