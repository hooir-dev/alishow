// routes/admin.js 文件的 controllers
const cateModel = require('../models/api/categoriesModel')
const indexModel = require('../models/api/indexModel')

exports.showAdmin = async (req, res, next) => {
  const [articleCount] = await indexModel.getArticleCount(next)
  const [articleDraftCount] = await indexModel.getArticleDraftCount(next)
  const [categoriesCount] = await indexModel.getCategoriesCount(next)
  const [commentsCount] = await indexModel.getCommentsCount(next)
  const [commentsUnratifiedCount] = await indexModel.getCommentsUnratifiedCount(next)

  res.render('admin/index.html', { page: 'index', articleCount: articleCount.count, articleDraftCount: articleDraftCount.count, categoriesCount: categoriesCount.count, commentsCount: commentsCount.count, commentsUnratifiedCount: commentsUnratifiedCount.count })
}
exports.showLogin = (req, res) => res.render('admin/login.html', { page: 'login' })
exports.showPosts = async (req, res, next) => res.render('admin/posts.html', { page: 'posts', child: 'posts', cateList: await cateModel.getCategoriesList(next) })
exports.showPostAdd = async (req, res, next) => res.render('admin/post-add.html', { page: 'posts', child: 'postsAdd', cateList: await cateModel.getCategoriesList(next) })
exports.showPostEdit = async (req, res, next) => {
  const {article_id} = req.query
  const reg = /^\d+$/
  if (!reg.test(article_id)) return res.render('admin/posts.html', { page: 'posts', child: 'posts', cateList: await cateModel.getCategoriesList(next) })
  res.render('admin/post-edit.html', { page: 'posts', child: 'postsEdit', cateList: await cateModel.getCategoriesList(next) })
}
exports.showCategories = (req, res) => res.render('admin/categories.html', { page: 'posts', child: 'categories' })
exports.showComments = (req, res) => res.render('admin/comments.html', { page: 'comments' })
exports.showUsers = (req, res) => res.render('admin/users.html', { page: 'users' })
exports.showMenus = (req, res) => res.render('admin/nav-menus.html', { page: 'setting', child: 'menus' })
exports.showSlides = (req, res) => res.render('admin/slides.html', { page: 'setting', child: 'slides' })
exports.showSettings = (req, res) => res.render('admin/settings.html', { page: 'setting', child: 'settings' })
exports.showProfile = (req, res) => res.render('admin/profile.html', { page: 'setting', child: 'profiles' })
exports.showPasswordReset = (req, res) => res.render('admin/password-reset.html', { page: 'setting', child: 'profiles' })
