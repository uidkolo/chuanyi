// pages/mine/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: '全部类目',
    kindId: '',
    end: false,
    shows: [],
    pageNo: 1,
    totalPage: 1,
    comments: [],
    commentPageNo: 1,
    commentTotalPage: 1,
    commentMask: false,
    commentType: 0, //0:评论 1:回复
    applyFocus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKinds()
    this.getShows()
  },
  // 获取分类
  getKinds() {
    let url = '/api/clothes/clothesKinds'
    getApp().get(url).then(data => {
      this.setData({
        kinds: data.kinds
      })
    })
  },
  // 选择类目
  pickerKind(e) {
    this.setData({
      kindId: parseInt(e.detail.value) + 1,
      kind: this.data.kinds[e.detail.value].name,
      shows: [],
      pageNo: 1,
      totalPage: 1
    })
    this.getComments()
  },
  // 获取买家秀列表
  getShows(){
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/comment/commentsList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        kind: this.data.kindId,
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        let shows = data.comments
        this.data.shows = this.data.shows.concat(shows)
        this.setData({
          shows: this.data.shows,
          pageNo: this.data.pageNo + 1,
          totalPage: data.total
        })
        if (this.data.pageNo - 1 == this.data.totalPage || data.total == 0) {
          this.setData({
            end: true
          })
        }
      })
    }
  },
  // 预览
  preview(e){
    let index = e.currentTarget.dataset.index
    let index2 = e.currentTarget.dataset.index2
    let arr = this.data.shows[index].imgs
    wx.previewImage({
      urls: arr,
      current: arr[index2]
    })

    this.addSeeCount(e.currentTarget.dataset.id, index)
  },
  // 增加查看次数
  addSeeCount(id,index){
    let url = '/api/comment/incSeeCount'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      comment_id: id
    }).then(()=>{
      this.data.shows[index].see_count++
      this.setData({
        shows: this.data.shows
      })
    })
  },
  // 点赞或取消点赞
  likeOrNotWorks(e) {
    let url = '/api/comment/likeOrNot'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      comment_id: e.currentTarget.dataset.id
    }).then(() => {
      let type = this.data.shows[e.currentTarget.dataset.index].liked //0：点赞 1：取消
      wx.showToast({
        title: type == 0 ? '点赞成功' : '取消成功',
      })
      this.data.shows[e.currentTarget.dataset.index].liked = type == 0 ? 1 : 0
      if (type == 0) {
        this.data.shows[e.currentTarget.dataset.index].like_count++
      } else {
        this.data.shows[e.currentTarget.dataset.index].like_count--
      }
      this.setData({
        shows: this.data.shows
      })
    })
  },
  // 获取评论列表
  getComment() {
    if (this.data.commentPageNo <= this.data.commentTotalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/show_comment/commentsList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        show_id: this.data.currentDesigntId,
        page: this.data.commentPageNo
      }).then(data => {
        wx.hideLoading()
        let comments = data.list
        this.data.comments = this.data.comments.concat(comments)
        this.setData({
          comments: this.data.comments,
          commentPageNo: this.data.commentPageNo + 1,
          commentTotalPage: data.total
        })
        if (this.data.commentPageNo - 1 == this.data.commentTotalPage || data.total == 0) {
          this.setData({
            end: true
          })
        }
      })
    }
  },
  // 查看评论
  showComment(e) {
    this.setData({
      commentMask: true,
      commentType: 0,
      currentDesignIndex: e.currentTarget.dataset.index,
      currentDesigntId: e.currentTarget.dataset.id,
      currentCommentCount: e.currentTarget.dataset.count,
      pageNo: 1,
      totalPage: 1,
      comments: [],
      commentPageNo: 1,
      commentTotalPage: 1
    })
    this.getComment()
  },
  // 关闭
  closeComment(e) {
    this.setData({
      commentType: 0,
      commentMask: false
    })
  },
  //input
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  //评论
  comment() {
    if (!this.data.commentContent) {
      wx.showToast({
        title: '请输入内容',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/show_comment/comment'
      wx.showLoading({
        title: '正在评论',
      })
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        show_id: this.data.currentDesigntId,
        content: this.data.commentContent
      }).then(data => {
        wx.hideLoading()
        this.data.comments.unshift(data.comment)
        this.data.shows[this.data.currentDesignIndex].comment_count++
        this.data.currentCommentCount++
        this.data.shows[this.data.currentDesignIndex].commented = 1
        this.setData({
          currentCommentCount: this.data.currentCommentCount,
          shows: this.data.shows,
          commentContent: '',
          comments: this.data.comments
        })
      })
    }
  },
  // 开始回复
  bindReply(e) {
    this.setData({
      applyFocus: true,
      commentType: 1,
      atName: e.currentTarget.dataset.user,
      atId: e.currentTarget.dataset.userid,
      currentCommentIndex: e.currentTarget.dataset.index,
      currentCommentId: e.currentTarget.dataset.id
    })
  },
  // 回复
  reply() {
    if (!this.data.replyContent) {
      wx.showToast({
        title: '请输入内容',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/show_comment/commentReply'
      wx.showLoading({
        title: '正在回复',
      })
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        show_id: this.data.currentDesigntId,
        to_comment: this.data.currentCommentId,
        content: this.data.replyContent,
        at_user: this.data.atId
      }).then(data => {
        wx.hideLoading()
        console.log(this.data.currentCommentIndex)
        this.data.comments[this.data.currentCommentIndex].replys.unshift(data.reply)
        this.data.shows[this.data.currentDesignIndex].comment_count++
        this.data.currentCommentCount++
        this.data.shows[this.data.currentDesignIndex].commented = 1
        this.setData({
          currentCommentCount: this.data.currentCommentCount,
          shows: this.data.shows,
          replyContent: '',
          comments: this.data.comments
        })
      })
    }
  },
  // 评论点赞或取消
  likeComment(e) {
    let url = '/api/show_comment/likeOrNotComment'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      object_id: e.currentTarget.dataset.id
    }).then(() => {
      let type = this.data.comments[e.currentTarget.dataset.index].liked //0：点赞 1：取消
      wx.showToast({
        title: type == 0 ? '点赞成功' : '取消成功',
      })
      this.data.comments[e.currentTarget.dataset.index].liked = type == 0 ? 1 : 0
      if (type == 0) {
        this.data.comments[e.currentTarget.dataset.index].like_count++
      } else {
        this.data.comments[e.currentTarget.dataset.index].like_count--
      }
      this.setData({
        comments: this.data.comments
      })
    })
  },
  // 回复点赞或取消
  likeReply(e) {
    let url = '/api/show_comment/likeOrNotReply'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      object_id: e.currentTarget.dataset.id
    }).then(() => {
      let index = e.currentTarget.dataset.index
      let index2 = e.currentTarget.dataset.index2
      let id = e.currentTarget.dataset.id
      let type = this.data.comments[index].replys[index2].liked //0：点赞 1：取消
      wx.showToast({
        title: type == 0 ? '点赞成功' : '取消成功',
      })
      this.data.comments[index].replys[index2].liked = type == 0 ? 1 : 0
      if (type == 0) {
        this.data.comments[index].replys[index2].like_count++
      } else {
        this.data.comments[index].replys[index2].like_count--
      }
      this.setData({
        comments: this.data.comments
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getShows()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})