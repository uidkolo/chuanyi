// pages/mine/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: '全部类目',
    kindId: '',
    end: false,
    comments: [],
    pageNo: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKinds()
    this.getComments()
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
      comments: [],
      pageNo: 1,
      totalPage: 1
    })
    this.getComments()
  },
  // 获取买家秀列表
  getComments(){
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
        let comments = data.comments
        this.data.comments = this.data.comments.concat(comments)
        this.setData({
          comments: this.data.comments,
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
    let arr = this.data.comments[index].imgs
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
      this.data.comments[index].see_count++
      this.setData({
        comments: this.data.comments
      })
    })
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
    this.getComments()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})