// pages/message/atMe/atMe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    totalPage: 1,
    messages: [],
    end: false,
    tabIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessages()
  },
  //tab
  tab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      pageNo: 1,
      totalPage: 1,
      messages: [],
      end: false
    })
    this.getMessages()
  },
  // 获取atMe消息
  getMessages() {
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      if (this.data.tabIndex == 0) {
        var url = '/api/message/atMeWorksComments'
      } else {
        var url = '/api/message/adMeShowComments'
      }
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        this.data.messages = this.data.messages.concat(data.list)
        this.setData({
          totalPage: data.total,
          pageNo: this.data.pageNo + 1,
          messages: this.data.messages
        })
        if (this.data.pageNo - 1 == this.data.totalPage || data.total == 0) {
          this.setData({
            end: true
          })
        }
      })
    }
  },
  navigator(e) {
    getApp().globalData.designId = e.currentTarget.dataset.id
    getApp().globalData.isFromDiscuss = true
    wx.switchTab({
      url: '/pages/works/works',
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
    this.getMessages()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shareInfo').word,
      path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
      imageUrl: wx.getStorageSync('shareInfo').cover
    }
  }
})