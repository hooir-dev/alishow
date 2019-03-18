$(function () {
  // 添加轮播图的表单验证
  $("#addSlides_form").validate({
    rules: {
      pic_url: {
        required: true
      },
      pic_text: {
        required: true
      },
      pic_link: {
        required: true
      }
    },
    messages: {
      pic_url: {
        required: '请上传一张图片'
      },
      pic_text: {
        required: '请填写轮播图文本'
      },
      pic_link: {
        required: '请填写轮播图链接'
      }
    },
    submitHandler: handleAdd
  })

  // 获取轮播图列表
  getSlidesList()
  function getSlidesList() {
    $.ajax({
      url: '/api/slides/list',
      method: 'GET',
      data: {},
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res
        status === 200 && $('#list_container').html(template('list_template', { list: data.data }))
      }
    })
  }

  // 上传图片预览事件
  $('#addSlides_form #slidesFile').on('change', function () {
    var reader = new FileReader()
    reader.readAsDataURL(this.files[0])
    reader.onload = function () {
      const type = this.result.slice(5, 10)
      if (type === 'image') {
        $('img[name=showSilde]').attr('src', this.result).attr('style', '').show()
      } else {
        layer.alert('只能上传图片文件，请重新选择', {
          skin: 'layui-layer-lan',
          btn: ['确定'],
          closeBtn: 0
        }, (index) => {
          $('#addSlides_form #slidesFile').val('')
          $('img[name=showSilde]').hide()
          layer.close(index)
        })
      }
    }
  })

  // 添加一个轮播图
  function handleAdd() {
    const formData = new FormData($('#addSlides_form')[0])

    $.ajax({
      url: '/api/slides/add',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        if (status === 201) {
          $('#addSlides_form input').val('')
          $('img[name=showSilde]').hide()
          getSlidesList()
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
      url: '/api/slides/delete',
      method: 'DELETE',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        if (status === 204) {
          $('a[name=deleteAll]').hide(500)
          $('input[name=selectAll]').prop('checked', false)
          getSlidesList()
        }
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
      url: '/api/slides/deleteBatch',
      method: 'DELETE',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res

        if (status === 204) {
          $('a[name=deleteAll]').hide(500)
          $('input[name=selectAll]').prop('checked', false)
          getSlidesList()
        }
      }
    })
  }
})
