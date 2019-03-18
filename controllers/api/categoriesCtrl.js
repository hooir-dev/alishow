// routes/api/categories.js 文件的 controllers
const cateModel = require('../../models/api/categoriesModel')

// 获取所有分类列表
exports.getCategoriesList = async (req, res, next) => {
  const result = await cateModel.getCategoriesList(next)

  res.send({
    data: {
      data: result
    },
    meta: {
      status: 200,
      message: '获取分类列表成功'
    }
  })
}

// 添加一个分类
exports.addCategories = async (req, res, next) => {
  const {cate_name, cate_slug} = req.body

  // 校验分类数量
  const countResult = await cateModel.getCategoriesCount(next)
  if (countResult[0].count >= 9) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '添加失败，分类数量不能超过 9 个，请联系超管！'
    }
  })

  await cateModel.addCategories(cate_name, cate_slug, next)
  res.send({
    data: {},
    meta: {
      status: 201,
      message: '添加分类成功'
    }
  })
}

// 删除一个分类
exports.deleteCategories = async (req, res, next) => {
  const { id } = req.body

  const countResult = await cateModel.getCategoriesCount(next)
  if (countResult[0].count <= 5) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '删除失败，最少要有 5 个分类，请联系超管'
    }
  })

  await cateModel.deleteCategoriesByIds(id, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除成功！'
    }
  })
}

// 批量删除分类
exports.deleteCategoriesBatch = async (req, res, next) => {
  const { ids } = req.body
  const delAll = ids.split(',')

  const countResult = await cateModel.getCategoriesCount(next)
  if (countResult[0].count - delAll.length < 5) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '删除失败，最少要保留五个分类，请联系超管！'
    }
  })

  await cateModel.deleteCategoriesByIds(delAll, next)
  res.send({
    data: {},
    meta: {
      status: 204,
      message: '删除分类成功！'
    }
  })
}

// 根据 id 获取分类信息
exports.getCategoriesInfo = async (req, res, next) => {
  const { id } = req.query

  const result = await cateModel.getCategoriesById(id, next)
  if (!result.length) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '获取分类信息失败，该分类已经被删除，请刷新候重试'
    }
  })

  res.send({
    data: {
      data: result[0]
    },
    meta: {
      status: 200,
      message: '获取分类信息成功'
    }
  })
}

// 编辑分类信息
exports.updateCategoryInfo = async (req, res, next) => {
  const { cate_name, cate_slug, cate_id } = req.body

  const idResult = await cateModel.getCategoriesById(cate_id, next)
  if (idResult.length === 0) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '修改失败，该分类已被删除，刷新后重试'
    }
  })

  let slugResult = null
  if (idResult[0].cate_slug !== cate_slug) slugResult = await cateModel.getCategoriesBySlug(cate_slug, next)
  if (slugResult && slugResult.length !== 0) return res.send({
    data: {},
    meta: {
      status: 209,
      message: '修改失败，该分类别名已经被占用'
    }
  })

  // 更新数据库信息
  await cateModel.changeCategoriesInfoById(cate_slug, cate_id, next)

  // 给出响应
  res.send({
    data: {},
    meta: {
      status: 200,
      message: cate_name ? '分类名称不能被更改，其余信息已经更新' : '编辑分类信息成功'
    }
  })

}

// 分类名称表单验证
exports.checkName = async (req, res, next) => {
  const {cate_name} = req.query
  const result = await cateModel.getCategoriesByName(cate_name, next)
  res.send(result.length === 0)
}

// 分类别名表单验证
exports.checkSlug = async (req, res, next) => {
  const {cate_slug} = req.query
  const result = await cateModel.getCategoriesByName(cate_slug, next)
  res.send(result.length === 0)
}
