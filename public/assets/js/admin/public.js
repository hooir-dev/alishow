// 更改前台 art-template 语法
template.defaults.rules[1].test = /{%([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*%}/

// 各个页面中点击 #list_container 里面复选框的操作
$('#list_container').on('click', 'input[name=select]', selectHandler)
function selectHandler() {
  const selectNum = $('#list_container [name=select]').length
  const activeSelectNum = $('#list_container [name=select]:checked').length

  activeSelectNum ? $('div[name=all]').show(500) : $('div[name=all]').hide(500)
  activeSelectNum && activeSelectNum === selectNum ? $('input[name=selectAll]').prop('checked', true) : $('input[name=selectAll]').prop('checked', false)
  activeSelectNum ? $('a[name=deleteAll]').show(500) : $('a[name=deleteAll]').hide(500)
  activeSelectNum && activeSelectNum === selectNum ? $('input[name=selectAll]').prop('checked', true) : $('input[name=selectAll]').prop('checked', false)
}

// 点击全选按钮的操作
$('input[name=selectAll]').on('change', selectAllHandler)
function selectAllHandler() {
  const state = $(this).prop('checked')
  $('#list_container [name=select]').prop('checked', state)
  state ? $('a[name=deleteAll]').show(500) : $('a[name=deleteAll]').hide(500)
  state ? $('div[name=all]').show(500) : $('div[name=all]').hide(500)
}

// ajax 的统一错误处理
$(document).ajaxError((event, response, settings) => {
  if (response.status === 500) {
    layer.alert('服务器出现问题，请稍后再试', {
      skin: 'layui-layer-lan',
      btn: ['确定'],
      time: 2000,
      closeBtn: 0
    }, (index) => {
      layer.close(index)
    })
  }

  if (response.status === 403) {
    layer.alert('您的登陆已经过期，请重新登陆', {
      skin: 'layui-layer-lan',
      btn: ['确定'],
      closeBtn: 0
    }, (index) => {
      layer.close(index)
      window.location.href = '/admin/logout'
    })
  }

  if (response.status === 401) {
    layer.alert('您没有权限进行该操作', {
      skin: 'layui-layer-lan',
      btn: ['确定'],
      time: 2000,
      closeBtn: 0
    }, (index) => {
      layer.close(index)
    })
  }

  if (response.status === 400) {
    layer.alert('参数数据格式不对，请检查后在试', {
      skin: 'layui-layer-lan',
      btn: ['确定'],
      time: 2000,
      closeBtn: 0
    }, (index) => {
      layer.close(index)
    })
  }
})

// ajax 的统一正确弹框处理处理
$(document).ajaxSuccess((event, response, settings) => {
  const res = JSON.parse(response.responseText)
  const { meta } = res

  if (meta && meta.status === 209) {
    layer.alert(meta.message, {
      skin: 'layui-layer-lan',
      btn: ['确定'],
      time: 2000,
      closeBtn: 0
    }, (index) => {
      layer.close(index)
    })
  }

  if (meta && (meta.status === 201 || meta.status === 203 || meta.status === 204)) {
    layer.alert(meta.message, {
      skin: 'layui-layer-molv',
      btn: ['确定'],
      time: 2000,
      closeBtn: 0
    }, (index) => {
      layer.close(index)
    })
  }
})
