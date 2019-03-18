// routes/index.js 文件的 controllers
const indexModel = require('../models/indexModel')

exports.showIndex = async (req, res, next) =>  res.render('index.html') //=> 前台首页的渲染
exports.showPosts = (req, res) => res.render('list.html') //=> 文章列表页面
exports.showDetail = (req, res) => res.render('detail.html') //=> 文章详情页面
