const multer = require('multer')
const path = require('path')

// 新增文章的配置
const addPostsStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/postsArticleShowPic'))
  },
  filename (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + Math.random().toString().slice(2) + path.extname(file.originalname))
  }
})

exports.addPosts = multer({storage: addPostsStorage})

// 文章的内容文件配置
const articleBodyPicStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/postsArticleBodyPic'))
  },
  filename (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + Math.random().toString().slice(2) + path.extname(file.originalname))
  }
})

exports.articleBodyPicStorage = multer({storage: articleBodyPicStorage})

// 用户头像的配置
const userAvatarStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/profilePic'))
  },
  filename (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + Math.random().toString().slice(2) + path.extname(file.originalname))
  }
})

exports.userAvatarStorage = multer({storage: userAvatarStorage})

// 轮播图上传图片的配置
const slidesAddStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/slidesPic'))
  },
  filename (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + Math.random().toString().slice(2) + path.extname(file.originalname))
  }
})

exports.slidesAddStorage = multer({storage: slidesAddStorage})
