$(function () {

  // 评论筛选信息
  listInfo = {
    currentPage: 1,
    currentSize: 10,
    totalPage: 1,
    state: ''
  }

  // 获取评论列表并渲染页面
  getCommentsList()
  function getCommentsList() {
    $.ajax({
      url: '/api/comments/list',
      method: 'GET',
      data: listInfo,
      dataType: 'json',
      success (res) {
        const {data, meta: {status}} = res

        if (status === 200) {
          listInfo.totalPage = data.totalPage
          data.data.forEach(item => item.cmt_addtime = item.cmt_addtime.split('T')[0])
          $('#list_container').html(template('list_template', {list: data.data}))
          selectHandler()
          $("#demo2").jqPaginator({
            totalPages: listInfo.totalPage,
            visiblePages: 9,
            currentPage: listInfo.currentPage,
            onPageChange: function(n) {
              $("#demo2-text").html(n)
              if (n !== listInfo.currentPage) {
                listInfo.currentPage = n
                getCommentsList()
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
    listInfo.state = $('select[name=state_select]').val()
    listInfo.currentPage = 1
    getCommentsList()
  }

  // 点击删除按钮的操作
  $('#list_container').on('click', '[name=delete]', deleteHandler)
  function deleteHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/comments/delete',
      method: 'DELETE',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 204 && getCommentsList()
      }
    })
  }

  // 点击批量删除按钮的操作
  $('button[name=deleteAll]').on('click', deleteAllHandler)
  function deleteAllHandler() {
    const delArr = []
    $('#list_container [name=select]:checked').each((index, item) => {
      delArr.push($(item).data('id'))
    })

    $.ajax({
      url: '/api/comments/deleteBatch',
      method: 'DELETE',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res

        if (status === 204) {
          listInfo.currentPage = 1
          getCommentsList()
        }
      }
    })
  }

  // 点击驳回按钮
  $('#list_container').on('click', '[name=refuse]', refuseHandler)
  function refuseHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/comments/refuse',
      method: 'PUT',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 203 && getCommentsList()
      }
    })
  }

  // 点击批量驳回按钮
  $('button[name=refuseAll]').on('click', refuseAllHandler)
  function refuseAllHandler() {
    const delArr = []
    $('#list_container [name=select]:checked').each((index, item) => {
      delArr.push($(item).data('id'))
    })

    $.ajax({
      url: '/api/comments/refuseBatch',
      method: 'PUT',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 203 && getCommentsList()
      }
    })
  }

  // 点击批准按钮
  $('#list_container').on('click', '[name=approval]', approvalHandler)
  function approvalHandler() {
    const id = $(this).data('id')

    $.ajax({
      url: '/api/comments/approval',
      method: 'PUT',
      data: { id },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 203 && getCommentsList()
      }
    })
  }


  // 点击批量批准按钮
  $('button[name=approvalAll]').on('click', approvalAllHandler)
  function approvalAllHandler() {
    const delArr = []
    $('#list_container [name=select]:checked').each((index, item) => {
      delArr.push($(item).data('id'))
    })

    $.ajax({
      url: '/api/comments/approvalBatch',
      method: 'PUT',
      data: { ids: delArr.toString() },
      dataType: 'json',
      success (res) {
        const {meta: {status}} = res
        status === 203 && getCommentsList()
      }
    })
  }
})
