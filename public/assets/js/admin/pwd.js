$(function () {
  // 重置密码的表单验证
  $('#userPwd_form').validate({
    rules: {
      admin_pwd: {
        required: true,
        maxlength: 16
      },
      admin_npwd: {
        required: true,
        maxlength: 16
      },
      admin_rnpwd: {
        required: true,
        maxlength: 16,
        equalTo: '#password'
      }
    },
    messages: {
      admin_pwd: {
        required: '请填写原始密码',
        maxlength: '用户密码最多 16 位'
      },
      admin_npwd: {
        required: '请填写新密码',
        maxlength: '用户密码最多 16 位'
      },
      admin_rnpwd: {
        required: '请再次填写新密码',
        maxlength: '用户密码最多 16 位',
        equalTo: '两次密码输入不一致'
      }
    },
    submitHandler: handleReset
  })

  // 提交新密码
  function handleReset() {
    const pwdInfo = $('#userPwd_form').serialize()

    $.ajax({
      url: '/api/profile/reset',
      method: 'PUT',
      data: pwdInfo,
      dataType: 'json',
      success (res) {
        const {meta: {status, message}} = res

        if (status == 200) {
          layer.alert(message, {
            skin: 'layui-layer-molv',
            btn: ['确定'],
            closeBtn: 0
          }, (index) => {
            window.location.href = '/admin/logout'
            layer.close(index)
          })
        }
      }
    })

    return false
  }
})