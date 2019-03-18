$(function () {
  let fileFlag = false

  // 编辑文章的表单验证
  $("#editPosts_form").validate({
    rules: {
      article_title: {
        required: true
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
        required: '请填写文章标题！'
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
    submitHandler: handleEdit
  })

  // 获取地址栏中参数信息
  const locationArr = window.location.search.split('?')[1]
  const locationObj = {}
  locationArr.split('&').forEach(item => {
    const tmpArr = item.split('=')
    locationObj[tmpArr[0]] = tmpArr[1]
  })

  // 获取被编辑文章信息
  getPostById()
  function getPostById() {
    $.ajax({
      url: '/api/posts/info',
      method: 'GET',
      data: {id: locationObj.article_id},
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res

        if (status === 200) {
          const info = data.data
          info.article_addtime = info.article_addtime.slice(0, -8)
          $('#editPosts_form').html(template('form_template', {data: info}))

          // 初始化富文本编辑器
          const E = window.wangEditor
          const editor = new E('#article_body')
          editor.customConfig.uploadImgShowBase64 = true
          editor.customConfig.uploadImgMaxSize = 6 * 1024 * 1024
          editor.customConfig.uploadImgMaxLength = 1
          editor.customConfig.uploadFileName = 'article_bodyPic'
          editor.customConfig.uploadImgServer = '/api/posts/add/articleBodyPic'
          editor.create()

          $('select[name=article_cateid]').val(info.article_cateid)
          $('select[name=article_status]').val(info.article_status)
          editor.txt.html(info.article_body)
        }
      }
    })
  }

  // 图片上传设置
  $('#editPosts_form').on('change', ' #feature', function (e) {
    var reader = new FileReader()
    reader.readAsDataURL(this.files[0])
    reader.onload = function () {
      const type = this.result.slice(5, 10)
      if (type === 'image') {
        $('img[name=showPic]').attr('src', this.result).show()
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

  // 上传编辑的内容
  function handleEdit() {
    const formData = new FormData($('#editPosts_form')[0])
    formData.append('article_body', editor.txt.html())
    if (fileFlag) formData.append('article_file', $('#editPosts_form #feature')[0].files[0])

    $.ajax({
      url: '/api/posts/edit',
      method: 'PUT',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
      success (res) {
        const {meta: {status, message}} = res

        if (status === 200) {
          layer.alert(message + '点击确定跳转回文章列表页', {
            skin: 'layui-layer-molv',
            btn: ['确定'],
            closeBtn: 0
          }, (index) => {
            window.location.href = '/admin/posts'
            layer.close(index)
          })
        }
      }
    })

    return false
  }
})
