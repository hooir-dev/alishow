$(function () {
  let fileFlag = false

  // 初始化富文本编辑器
  const E = window.wangEditor
  const editor = new E('#article_body')
  editor.customConfig.uploadImgShowBase64 = true
  editor.customConfig.uploadImgMaxSize = 6 * 1024 * 1024
  editor.customConfig.uploadImgMaxLength = 1
  editor.customConfig.uploadFileName = 'article_bodyPic'
  editor.customConfig.uploadImgServer = '/api/posts/add/articleBodyPic'
  editor.create()

  // 添加文章的表单验证
  $("#addPosts_form").validate({
    rules: {
      article_title: {
        required: true,
        remote: '/api/posts/check_articleTitle'
      },
      article_slug: {
        minlength: 2,
        maxlength: 10
      },
      article_cateid: {
        required: true
      },
      article_addtime: {
        required: true
      },
      article_status: {
        required: true
      }
    },
    messages: {
      article_title: {
        required: '请填写文章标题！',
        remote: '该文章标题已被占用！'
      },
      article_slug: {
        minlength: '文章别名，最少有 2 个字组成！',
        maxlength: '文章别名，最多有 10 个字组成！'
      },
      article_cateid: {
        required: '请选择分类！'
      },
      article_addtime: {
        required: '请选择时间！'
      },
      article_status: {
        required: '请选择状态！'
      }
    },
    submitHandler: handleAdd
  })

  // 添加文章的操作
  function handleAdd() {
    const formData = new FormData($('#addPosts_form')[0])
    formData.append('article_body', editor.txt.html())
    if (fileFlag) formData.append('article_file', $('#addPosts_form #feature')[0].files[0])

    $.ajax({
      url: '/api/posts/add',
      method: 'POST',
      processData: false,
      contentType: false,
      data: formData,
      dataType: 'json',
      success (res) {
        const {meta: {status, message}} = res

        if (status === 200) {
          layer.alert(message, {
            skin: 'layui-layer-molv',
            btn: ['确定'],
            closeBtn: 0
          }, (index) => {
            layer.close(index)
            window.location.href = '/admin/posts'
          })
        }
      }
    })

    return false
  }

  // 上传头像的操作
  $('#addPosts_form #feature').on('change', function (e) {
    var reader = new FileReader()
    reader.readAsDataURL(this.files[0])
    reader.onload = function () {
      const type = this.result.slice(5, 10)
      if (type === 'image') {
        $('img[name=showPic]').attr('src', this.result).attr('style', '').show()
        fileFlag = true
      } else {
        fileFlag = false
        layer.alert('只能上传图片文件，请重新选择', {
          skin: 'layui-layer-lan',
          btn: ['确定'],
          closeBtn: 0
        }, (index) => {
          $('#addPosts_form #feature').val('')
          $('img[name=showPic]').hide()
          layer.close(index)
        })
      }
    }
  })
})
