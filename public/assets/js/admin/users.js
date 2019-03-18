$(function () {
  // 分页信息
  const listInfo = {
    currentPage: 1,
    currentSize: 10,
    search: '',
    totalPage: 1
  }

  // 添加用户的表单验证
  $("#addUser_form").validate({
    rules: {
      admin_email: {
        required: true,
        remote: '/api/users/check_email'
      },
      admin_slug: {
        required: true,
        minlength: 2,
        maxlength: 10
      },
      admin_nickname: {
        required: true,
        minlength: 2,
        maxlength: 10,
        remote: '/api/users/check_nickname'
      },
      admin_pwd: {
        required: true,
        maxlength: 16
      }
    },
    messages: {
      admin_email: {
        remote: '该邮箱已被占用'
      },
      admin_nickname: {
        remote: '该昵称已被占用'
      },
      admin_pwd: {
        required: '请填写用户密码',
        maxlength: '用户密码最多 16 位'
      }
    },
    submitHandler: handleAdd
  })

  // 编辑用户的表单验证
  $("#editUser_form").validate({
    rules: {
      admin_slug: {
        required: true,
        minlength: 2,
        maxlength: 10
      },
      admin_nickname: {
        required: true,
        minlength: 2,
        maxlength: 10
      },
      admin_tel: {
        minlength: 11,
        maxlength: 11
      },
      admin_age: {
        min: 18,
        max: 120
      }
    },
    messages: {
      admin_email: {
        remote: '该邮箱已被占用'
      },
      admin_nickname: {
        remote: '该昵称已被占用'
      },
      admin_tel: {
        minlength: '手机号必须是 11 位',
        maxlength: '手机号必须是 11 位'
      },
      admin_age: {
        min: '用户未成年',
        max: '您的年龄太大了，回家休息休息把'
      }
    },
    submitHandler: handleEdit
  })

  // 获取用户列表并渲染页面
  getUserList()
  function getUserList() {
    $.ajax({
      url: '/api/users/list',
      method: 'GET',
      data: listInfo,
      dataType: 'json',
      success (res) {
        const { data, meta: {status} } = res
        status === 209 && (listInfo.currentPage = listInfo.totalPage = 1)
        status === 200 && (listInfo.totalPage = data.totalPage)

        if (status === 209 || status === 200) {
          $('#list_container').html(template('list_template', { list: data.data }))
          selectHandler()
          $('.switchBtn').each((index, item) => {
            new Switch(item, {
              size: 'small',
              showText: true,
              onText: '活',
              offText: '禁',
              offSwitchColor: 'red',
            })
          })
          $("#demo2").jqPaginator({
            totalPages: listInfo.totalPage,
            visiblePages: 9,
            currentPage: listInfo.currentPage,
            onPageChange: function(n) {
              $("#demo2-text").html(n)
              if (n !== listInfo.currentPage) {
                listInfo.currentPage = n
                getUserList()
              }
            }
          })
        }
      }
    })
  }

  // 添加用户
  function handleAdd() {
    const formData = $('#addUser_form').serialize()

    $.ajax({
      url: '/api/users/add',
      method: 'POST',
      data: formData,
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res
        status === 209 && $(`input[name=${data.type}]`).val('')

        if (status === 201) {
          $('#addUser_form input').val('')
          getUserList()
        }
      }
    })

    return false
  }

  // 点击删除按钮的操作
  $('#list_container').on('click', '[name=destroy]', deleteHandler)
  function deleteHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/users/delete',
      method: 'DELETE',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 204 && getUserList()
      }
    })
  }

  // 点击批量删除按钮的操作
  $('a[name=deleteAll]').on('click', deleteAllHandler)
  function deleteAllHandler() {
    const delArr = []
    $('#list_container [name=select]:checked').each((index, item) => {
      delArr.push($(item).data('id'))
    })

    $.ajax({
      url: '/api/users/deleteBatch',
      method: 'DELETE',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res

        if (status === 204) {
          $('a[name=deleteAll]').hide(500)
          $('input[name=selectAll]').prop('checked', false)
          getUserList()
        }
      }
    })
  }

  // 搜索框事件
  $('input.searchByEmail').on('input', function () {
    listInfo.search = this.value
    listInfo.currentPage = 1
    $('a[name=deleteAll]').hide(500)
    getUserList()
  })

  // 改变用户状态的 button 按钮事件
  $('#list_container').on('click', changeStateHandler)
  function changeStateHandler(e) {
    if (e.target.tagName === 'SMALL' || e.target.tagName === 'SPAN') {
      const state = $(e.target).parents('td').find('input').prop('checked')
      const id = $(e.target).parents('td').find('input').data('id')

      $.ajax({
        url: '/api/users/changeState',
        method: 'PUT',
        data: { state, id },
        dataType: 'json',
        success (res) {
          const {meta: {status, message}} = res

          if (status === 200) {
            layer.alert(message, {
              skin: 'layui-layer-molv',
              btn: ['确定'],
              time: 2000,
              closeBtn: 0
            }, (index) => {
              layer.close(index)
            })
          }
        }
      })
    }
  }

  // 点击编辑展示编辑模态框
  $('#list_container').on('click', 'a[name=editUser]', editHandler)
  function editHandler() {
    const id = $(this).data('id')
    $.ajax({
      url: '/api/users/info',
      method: 'GET',
      data: { id },
      dataType: 'json',
      success (res) {
        const { data, meta: {status} } = res

        if (status === 200) {
          const { data: info } = data
          $('#editUser_form input[name=admin_email]').val(info.admin_email)
          $('#editUser_form input[name=admin_nickname]').val(info.admin_nickname)
          $('#editUser_form input[name=admin_slug]').val(info.admin_slug)
          $('#editUser_form input[name=admin_tel]').val(info.admin_tel)
          $('#editUser_form input[name=admin_age]').val(info.admin_age)
          $('#editUser_form input[name=admin_id]').val(info.admin_id)
          $('#editUser_form select[name=admin_gender]').val(info.admin_gender)
          $('#editModal').modal('show')
        }
      }
    })
  }

  // 确认编辑的操作
  function handleEdit() {
    const formData = $('#editUser_form').serialize()

    // 发送请求
    $.ajax({
      url: '/api/users/updateInfo',
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
            time: 2000,
            closeBtn: 0
          }, (index) => {
            layer.close(index)
          })
        }
      }
    })

    return false
  }
})
