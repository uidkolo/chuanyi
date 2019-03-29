// pages/works/works.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    designs: [],
    pageNo: 1,
    totalPage: 1,
    comments: [],
    commentPageNo: 1,
    commentTotalPage: 1,
    commentMask: false,
    commentType: 0, //0:评论 1:回复
    applyFocus: false,
    mask: true,
    designId: '',
    currentDesignIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.id){
      this.setData({
        designId:options.id
      })
    }
    this.getDesigns()
  },
  // 滑动
  bindanimationfinish(e) {
    this.getDesigns()
    this.setData({
      currentDesignIndex: e.detail.current
    })
  },
  // 获取作品
  getDesigns() {
    if (this.data.pageNo <= this.data.totalPage) {
      let url = '/api/works_site/worksList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        page: this.data.pageNo,
        design_id: this.data.designId,
        limit: 5
      }).then(data => {
        wx.hideLoading()
        let designs = data.works
        this.data.designs = this.data.designs.concat(designs)
        this.setData({
          designs: this.data.designs,
          pageNo: this.data.pageNo + 1,
          totalPage: data.total
        })
      })
    }
  },
  // 进入我的作品
  toMyWork() {
    let url = '/api/designer/applyDesignerResult'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      if (data.status == 0) { //未申请=>申请页面
        wx.navigateTo({
          url: '/pages/works/applyJoin/applyJoin',
        })
      } else if (data.status == 1) { //审核中
        wx.showToast({
          title: '审核中',
          image: '/images/tip.png'
        })
      } else if (data.status == 2) { // 通过=> 我的作品
        wx.navigateTo({
          url: '/pages/works/myWorks/myWorks',
        })
      } else if (data.status == 3) { //未通过 =>申请页面
        wx.navigateTo({
          url: '/pages/works/applyJoin/applyJoin',
        })
      }
    })
  },
  // 关注或取关
  followOrCancel(e) {
    if (this.data.designs[e.currentTarget.dataset.index].designer.is_follow == 1) {
      wx.showModal({
        content: '确认取消关注？',
        success: res => {
          if (res.confirm) {
            let url = '/api/works_site/followOrCancel'
            getApp().post(url, {
              token: wx.getStorageSync('auth_token'),
              designer_id: e.currentTarget.dataset.id
            }).then(() => {
              wx.showToast({
                title: this.data.designs[e.currentTarget.dataset.index].designer.is_follow == 0 ? '关注成功' : '取关成功',
              })
              this.data.designs[e.currentTarget.dataset.index].designer.is_follow = this.data.designs[e.currentTarget.dataset.index].designer.is_follow == 0 ? 1 : 0
              this.setData({
                designs: this.data.designs
              })
            })
          }
        }
      })
    } else {
      let url = '/api/works_site/followOrCancel'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        designer_id: e.currentTarget.dataset.id
      }).then(() => {
        wx.showToast({
          title: this.data.designs[e.currentTarget.dataset.index].designer.is_follow == 0 ? '关注成功' : '取关成功',
        })
        this.data.designs[e.currentTarget.dataset.index].designer.is_follow = this.data.designs[e.currentTarget.dataset.index].designer.is_follow == 0 ? 1 : 0
        this.setData({
          designs: this.data.designs
        })
      })
    }

  },
  // 点赞或取消点赞
  likeOrNotWorks(e) {
    let url = '/api/works_site/likeOrNotWorks'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      object_id: e.currentTarget.dataset.id
    }).then(() => {
      let type = this.data.designs[e.currentTarget.dataset.index].liked //0：点赞 1：取消
      wx.showToast({
        title: type == 0 ? '点赞成功' : '取消成功',
      })
      this.data.designs[e.currentTarget.dataset.index].liked = type == 0 ? 1 : 0
      if (type == 0) {
        this.data.designs[e.currentTarget.dataset.index].like_count++
      } else {
        this.data.designs[e.currentTarget.dataset.index].like_count--
      }
      this.setData({
        designs: this.data.designs
      })
    })
  },
  // 收藏或取消收藏
  addOrCancelFavroite(e) {
    let url = '/api/favorite/addOrCancelFavroite'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      design_id: e.currentTarget.dataset.id
    }).then(() => {
      let type = this.data.designs[e.currentTarget.dataset.index].collected //0：收藏 1：取消
      wx.showToast({
        title: type == 0 ? '收藏成功' : '取消成功',
      })
      this.data.designs[e.currentTarget.dataset.index].collected = type == 0 ? 1 : 0
      if (type == 0) {
        this.data.designs[e.currentTarget.dataset.index].collect_count++
      } else {
        this.data.designs[e.currentTarget.dataset.index].collect_count--
      }
      this.setData({
        designs: this.data.designs
      })
    })
  },
  // 获取评论列表
  getComment() {
    if (this.data.commentPageNo <= this.data.commentTotalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/design_comment/commentsList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        design_id: this.data.currentDesigntId,
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
      let url = '/api/design_comment/comment'
      wx.showLoading({
        title: '正在评论',
      })
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        design_id: this.data.currentDesigntId,
        content: this.data.commentContent
      }).then(data => {
        wx.hideLoading()
        this.data.comments.unshift(data.comment)
        this.data.designs[this.data.currentDesignIndex].comment_count++
          this.data.currentCommentCount++
          this.data.designs[this.data.currentDesignIndex].commented = 1
        this.setData({
          currentCommentCount: this.data.currentCommentCount,
          designs: this.data.designs,
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
      let url = '/api/design_comment/commentReply'
      wx.showLoading({
        title: '正在回复',
      })
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        design_id: this.data.currentDesigntId,
        to_comment: this.data.currentCommentId,
        content: this.data.replyContent,
        at_user: this.data.atId
      }).then(data => {
        wx.hideLoading()
        console.log(this.data.currentCommentIndex)
        this.data.comments[this.data.currentCommentIndex].replys.unshift(data.reply)
        this.data.designs[this.data.currentDesignIndex].comment_count++
          this.data.currentCommentCount++
          this.data.designs[this.data.currentDesignIndex].commented = 1
        this.setData({
          currentCommentCount: this.data.currentCommentCount,
          designs: this.data.designs,
          replyContent: '',
          comments: this.data.comments
        })
      })
    }
  },
  // 评论点赞或取消
  likeComment(e) {
    let url = '/api/design_comment/likeOrNotComment'
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
    let url = '/api/design_comment/likeOrNotReply'
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
  // 关闭弹层
  closeMask(){
    this.setData({
      mask: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let designId = getApp().globalData.designId
    let isFromDiscuss = getApp().globalData.isFromDiscuss
    getApp().globalData.designId = null
    getApp().globalData.isFromDiscuss = false
    if (designId!=null){
      this.setData({
        designs: [],
        pageNo: 1,
        designId: designId,
        currentDesigntId: designId,
        commentMask: isFromDiscuss,
        comments: [],
        commentPageNo: 1
      })
      this.getDesigns()
      if (isFromDiscuss!=null){
        this.getComment()
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.designs[this.data.currentDesignIndex].clothes_name,
      path: `/pages/works/works?id=${this.data.designs[this.data.currentDesignIndex].id}`,
      imageUrl: this.data.designs[this.data.currentDesignIndex].front_thumb
    }
  }
})