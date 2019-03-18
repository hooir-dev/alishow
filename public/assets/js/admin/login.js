(function (window) {
  $("#login_form").validate({
    rules: {
      admin_email: {
        required: true,
      },
      admin_pwd: {
        required: true
      }
    },
    submitHandler: handleLogin
  })

  function handleLogin() {
    const formData = $('#login_form').serialize()

    $.ajax({
      url: '/admin/login',
      method: 'POST',
      data: formData,
      dataType: 'json',
      success (res) {
        const { meta: { status, message } } = res

        if (status === 205) {
          layer.alert(message, {
            skin: 'layui-layer-lan',
            btn: ['确定'],
            time: 2000,
            closeBtn: 0
          }, (index) => {
            layer.close(index)
          })
        }

        if (status === 203) {
          layer.alert(message, {
            skin: 'layui-layer-lan',
            btn: ['确定'],
            time: 2000,
            closeBtn: 0
          }, (index) => {
            layer.close(index)
          })
        }

        if (status === 200) {
          layer.alert(message + '点击确定跳转到首页', {
            skin: 'layui-layer-molv',
            btn: ['确定'],
            closeBtn: 0
          }, (index) => {
            layer.close(index)
            window.location.href = '/admin'
          })
        }
      },
      error (err) {
        if (err) {
          layer.alert('服务器出错了，请稍后在试', {
            skin: 'layui-layer-lan',
            btn: ['确定'],
            closeBtn: 0,
            time: 2000
          }, (index) => {
            layer.close(index)
          })
        }
      }
    })

    return false

  }
})(window)
