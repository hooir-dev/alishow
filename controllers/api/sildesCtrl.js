// routes/api/slides.js 文件的 controllers
const slidesModel = require('../../models/api/slidesModel')

// 获取轮播图列表
exports.getSlidesList = async (req, res, next) => {
  const result = await slidesModel.getSlidesList(next)
  res.send({
    data: {
      data: result
    },
    meta: {
      status: 200,
      message: '获取轮播图列表成功'
    }
  })
}

// 添加一个轮播图
exports.addSlide = async (req, res, next) => {
  const { filename } = req.file
  const { pic_text, pic_link } = req.body

  const result = await slidesModel.getSlidesCount(next)
  if (result[0].count >= 7) {
    return res.send({
      data: {},
      meta: {
        status: 209,
        message: '最多只能有 7 张轮播图'
      }
    })
  }

  await slidesModel.addSlide('/public/uploads/slidesPic/' + filename, pic_text, pic_link, next)
  res.send({
    data: {},
    meta: {
      status: 201,
      message: '添加轮播图成功'
    }
  })
}

// 删除一个轮播图
exports.deleteSlide = async (req, res, next) => {
  const { id } = req.body

  const result = await slidesModel.getSlidesCount(next)
  if (result[0].count <= 2) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '删除失败，最少要有两张轮播图'
    }
  })

  await slidesModel.deleteSlidesByIds(id, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除成功'
    }
  })
}

// 批量删除轮播图
exports.deleteSlideBatch = async (req, res, next) => {
  const { ids } = req.body
  const delAll = ids.split(',')

  const result = await slidesModel.getSlidesCount(next)
  if (result[0].count - delAll.length <= 2) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '删除失败，最少要有两张轮播图'
    }
  })

  await slidesModel.deleteSlidesByIds(delAll, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '批量删除成功'
    }
  })
}
