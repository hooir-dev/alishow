$(function () {
  let fileFlag = false

  // 修改用户信息的表单验证
  $("#userInfo_form").validate({
    rules: {
      admin_slug: {
        minlength: 2,
        maxlength: 10
      },
      admin_nickname: {
        required: true,
        minlength: 2,
        maxlength: 10
      },
      admin_sign: {
        maxlength: 200
      }
    },
    messages: {
      admin_slug: {
        minlength: '最少由 2 个字组成',
        maxlength: '最多由 10 个字组成'
      },
      admin_nickname: {
        required: '请填写用户昵称',
        minlength: 2,
        maxlength: 10
      },
      admin_sign: {
        maxlength: '最多填写 200 个文字'
      }
    },
    submitHandler: handleUpdate
  })

  // 获取用户信息
  getUserInfo()
  function getUserInfo() {
    $.ajax({
      url: '/api/profile/info',
      method: 'GET',
      data: {},
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res
        if (status === 200) {
          const {data: info} = data

          $('#userInfo_form [name=admin_email]').val(info.admin_email)
          $('#userInfo_form [name=admin_slug]').val(info.admin_slug)
          $('#userInfo_form [name=admin_nickname]').val(info.admin_nickname)
          $('#userInfo_form [name=admin_id]').val(info.admin_id)
          $('#userInfo_form textarea').html(info.admin_sign)

          const imgDom = new Image()
          imgDom.src = info.admin_pic
          imgDom.onerror = function () {
            $('#userInfo_form [name=showAvatar]').attr('src', '/public/assets/img/default.png')
            layer.alert('您还没有上传头像或者头像已经被删除，请重新上传', {
              skin: 'layui-layer-lan',
              btn: ['确定'],
              time: 2000,
              closeBtn: 0
            }, (index) => {
              layer.close(index)
            })
          }
          imgDom.onload = function () {
            $('#userInfo_form [name=showAvatar]').attr('src', this.src)
          }
        }
      }
    })
  }

  // 上传头像的操作
  $('#userInfo_form #avatar').on('change', function (e) {
    var reader = new FileReader()
    reader.readAsDataURL(this.files[0])
    reader.onload = function () {
      const type = this.result.slice(5, 10)
      if (type === 'image') {
        $('img[name=showAvatar]').attr('src', this.result).attr('style', '').show()
        fileFlag = true
      } else {
        fileFlag = false
        layer.alert('只能上传图片文件，请重新选择', {
          skin: 'layui-layer-lan',
          btn: ['确定'],
          closeBtn: 0
        }, (index) => {
          $('#userInfo_form #avatar').val('')
          layer.close(index)
        })
      }
    }
  })

  // 点击更新的时候的操作
  function handleUpdate() {
    const formData = new FormData($('#userInfo_form')[0])
    if (fileFlag) {
      formData.append('userAvatar', $('#userInfo_form #avatar')[0].files[0])
    }

    $.ajax({
      url: '/api/profile/update',
      method: 'PUT',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res

        if (status === 203) {
          getUserInfo()
          fileFlag = false
        }
      }
    })

    return false
  }
})