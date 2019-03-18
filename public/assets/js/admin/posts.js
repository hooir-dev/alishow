$(function () {
  // 分页筛选信息
  listInfo = {
    currentPage: 1,
    currentSize: 10,
    totalPage: 1,
    category: '',
    status: ''
  }

  // 获取文章列表并渲染到页面
  getPostsList()
  function getPostsList() {
    $.ajax({
      url: '/api/posts/list',
      method: 'GET',
      data: listInfo,
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res

        status === 200 && data.data.forEach(item => item.article_addtime = item.article_addtime.split('T')[0] )

        if (status === 200 || status === 209) {
          listInfo.totalPage = data.totalPage
          $('#list_container').html(template('list_template', { list: data.data }))
          selectHandler()
          $("#demo2").jqPaginator({
            totalPages: listInfo.totalPage,
            visiblePages: 9,
            currentPage: listInfo.currentPage,
            onPageChange: function(n) {
              $("#demo2-text").html(n)
              if (n !== listInfo.currentPage) {
                listInfo.currentPage = n
                getPostsList()
              }
            }
          })
        }
      }
    })
  }

  // 点击筛选按钮的操作
  $('button[name=screen]').on('click', screenHandler)
  function screenHandler() {
    const category = $('select[name=cate_select]').val()
    const status = $('select[name=status_select]').val()
    listInfo.category = category
    listInfo.status = status
    listInfo.currentPage = 1
    getPostsList()
  }

  // 点击删除按钮的操作
  $('#list_container').on('click', 'button[name=destroy]', deleteHandler)
  function deleteHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/posts/delete',
      method: 'DELETE',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 204 && getPostsList()
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
      url: '/api/posts/deleteBatch',
      method: 'DELETE',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res

        if (status === 204) {
          listInfo.currentPage = 1
          getPostsList()
        }
      }
    })
  }

  // 点击编辑文章的操作
  $('#list_container').on('click', '[name=edit]', editHandler)
  function editHandler() {
    const id = $(this).data('id')
    const userId = $(this).data('userId')
    const adminId = $(this).data('adminId')

    if (userId !== adminId) {
      return layer.alert('您不能编辑别人的文章！', {
        skin: 'layui-layer-lan',
        btn: ['确定'],
        time: 2000,
        closeBtn: 0
      }, (index) => {
        layer.close(index)
      })
    }

    $.ajax({
      url: '/api/posts/jumpEdit',
      method: 'GET',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 200 && (window.location.href = '/admin/posts/edit?article_id=' + id)
      }
    })
  }
})
