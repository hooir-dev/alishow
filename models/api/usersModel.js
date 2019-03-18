// controllers/api/usersCtrl.js 文件的 model
const query = require('../../utils/query')

// 通过用户邮箱获取用户信息
exports.getUserInfoByEmail = (email, next) => query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [email], next)

// 通过用户昵称获取用户信息
exports.getUsenInfoByNickname = (nickname, next) => query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?', [nickname], next)

// 分页获取用户列表
exports.getUsersList = (page, size, search, next) => query('SELECT * FROM `ali_admin` WHERE `admin_email` LIKE \'%' + search + '%\' ORDER BY `admin_id` ASC LIMIT ' + `${page}, ${size}`, [], next)

// 获取全部用户数量
exports.getUserCount = (search, next) => query('SELECT COUNT(admin_email) `count` FROM `ali_admin` WHERE `admin_email` LIKE \'%' + search + '%\'', [], next)

// 添加新用户
exports.addUser = (email, slug, nickname, pwd, next) => query('INSERT INTO `ali_admin` SET `admin_email`=?, `admin_slug`=?, `admin_nickname`=?, `admin_pwd`=?, `admin_state`=?', [email, slug, nickname, pwd, '禁用'], next)

// 根据 id 删除用户
exports.deleteUsersByIds = (ids, next) => query('DELETE FROM `ali_admin` WHERE `admin_id` in(?)', [ids], next)

// 根据 id 改变用户状态
exports.changeUserStateById = (state, id, next) => query('UPDATE `ali_admin` SET `admin_state`=? WHERE `admin_id`=?', [state, id], next)

// 根据 id 获取用户信息
exports.getUserInfoById = (id, next) => query('SELECT * FROM `ali_admin` WHERE `admin_id`=?', [id], next)

// 根据 id 更新用户信息
exports.changeUserInfoById = (nickname, slug, tel, age, gender, id, next) => query('UPDATE `ali_admin` SET `admin_nickname`=?, `admin_slug`=?, `admin_tel`=?, `admin_age`=?, `admin_gender`=? WHERE `admin_id`=?', [nickname, slug, tel, age, gender, id], next)
