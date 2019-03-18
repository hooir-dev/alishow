// controllers/api/profileCtrl.js 文件的 model
const query = require('../../utils/query')

// 更新用户信息
exports.updateUserInfo = (info, id, next) => query('UPDATE `ali_admin` SET ? WHERE `admin_id`=?', [info, id], next)

// 更改用户密码
exports.updateUserPwd = (pwd, id, next) => query('UPDATE `ali_admin` SET `admin_pwd`=? WHERE `admin_id`=?', [pwd, id], next)
