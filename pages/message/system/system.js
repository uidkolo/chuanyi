// pages/message/system/system.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    totalPage: 1,
    messages:[],
    end: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMessages()
  },
  // 获取系统消息
  getMessages() {
    if (this.data.pageNo <= this.data.totalPage){
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/message/systemMessage'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        this.data.messages = this.data.messages.concat(data.list)
        console.log(data.list)
        this.setData({
          totalPage: data.total,
          pageNo: this.data.pageNo+1,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})