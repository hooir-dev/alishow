$(function () {

  // 添加分类的表单验证
  $("#addCate_form").validate({
    rules: {
      cate_name: {
        required: true,
        maxlength: 10,
        remote: '/api/categories/check_name'
      },
      cate_slug: {
        required: true,
        maxlength: 10,
        remote: '/api/categories/check_slug'
      }
    },
    messages: {
      cate_name: {
        remote: '该分类已经存在'
      },
      cate_slug: {
        remote: '该别名已经存在'
      }
    },
    submitHandler: handleAdd
  })

  // 编辑分类的表单验证
  $("#editCate_form").validate({
    rules: {
      cate_slug: {
        required: true,
        maxlength: 10
      }
    },
    submitHandler: handleEdit
  })

  // 获取分类列表
  getCategoriesList()
  function getCategoriesList() {
    $.ajax({
      url: '/api/categories/list',
      method: 'GET',
      data: {},
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res
        status === 200 && $('#list_container').html(template('list_template', { list: data.data }))
      }
    })
  }

  // 添加分类
  function handleAdd() {
    const formData = $('#addCate_form').serialize()

    $.ajax({
      url: '/api/categories/add',
      method: 'POST',
      data: formData,
      dataType: 'json',
      success (res) {
        const {data, meta: {status, message}} = res

        if (status === 209) $(`#addCate_form input[name=${data.type}]`).val('')

        if (status === 201) {
          getCategoriesList()
          $('#addCate_form input').val('')
        }
      }
    })

    return false
  }

  // 删除分类
  $('#list_container').on('click', 'a[name=destroy]', deleteHandler)
  function deleteHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/categories/delete',
      method: 'DELETE',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 204 && getCategoriesList()
      }
    })
  }

  // 点击批量删除按钮操作
  $('a[name=deleteAll]').on('click', deleteAllHandler)
  function deleteAllHandler() {
    const delArr = []
    $('#list_container [name=select]:checked').each((index, item) => {
      delArr.push($(item).data('id'))
    })

    $.ajax({
      url: '/api/categories/deleteBatch',
      method: 'DELETE',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        if (status === 204) {
          $('a[name=deleteAll]').hide(500)
          $('input[name=selectAll]').prop('checked', false)
          getCategoriesList()
        }
      }
    })
  }

  // 点击编辑展示编辑模态框
  $('#list_container').on('click', 'a[name=editCate]', editHandler)
  function editHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/categories/info',
      method: 'GET',
      data: { id },
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res

        if (status === 200) {
          const {data: info} = data
          $('#editCate_form input[name=cate_name]').val(info.cate_name)
          $('#editCate_form input[name=cate_slug]').val(info.cate_slug)
          $('#editCate_form input[name=cate_id]').val(info.cate_id)
          $('#editModal').modal('show')
        }
      }
    })
  }

  // 确认编辑的操作
  function handleEdit() {
    const formData = $('#editCate_form').serialize()

    $.ajax({
      url: '/api/categories/edit',
      method: 'PUT',
      data: formData,
      dataType: 'json',
      success (res) {
        const {meta: {status, message}} = res

        if (status === 200) {
          $('#editModal').modal('hide')
          layer.alert(message, {
            skin: 'layui-layer-molv',
            btn: ['确定'],
            closeBtn: 0
          }, (index) => {
            getCategoriesList()
            layer.close(index)
          })
        }
      }
    })

    return false
  }
})
