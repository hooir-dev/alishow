// 各个模块正则表达式

// 单独 id 验证
exports.numberReg = /^\d+$/

// 评论列表的状态验证
exports.commentStateReg = /^已批准$|^未批准$/

// 数字字母下划线（别名/昵称/各类名称）验证
exports.nameReg = /^.{2,10}$/

// 密码验证
exports.pwdReg = /^.{1,16}$/

// 文章列表的状态验证
exports.postsStatusReg = /^已发布$|^草稿$/

// 时间的验证
exports.timeReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

// true or false
exports.booReg = /^true$|^false$/

// 邮箱的验证
exports.emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/

// 性别的验证
exports.genderReg = /^男$|^女$/

// 手机的验证
exports.phoneReg = /^(0|\+86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/

// 年龄的验证
exports.ageReg = /^19$|^[2-9][0-9]$|^1[0-1][0-9]$|^120$/
