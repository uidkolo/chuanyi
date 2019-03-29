// pages/works/myWorks/fans/fans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 1,
    list: [],
    seven_days_fans: [],
    end: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFans()
  },
  // 获取粉丝列表
  getFans() {
    if (this.data.page <= this.data.total) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/designer/myFans'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        page: this.data.page
      }).then(data=>{
        wx.hideLoading()
        this.setData({
          total: data.total,
          seven_days_count: data.seven_days_count,
          list: this.data.list.concat(data.list),
          seven_days_fans: data.seven_days_fans
        })
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
    this.getFans()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: wx.getStorageSync('shareInfo').word,
      path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
      imageUrl: wx.getStorageSync('shareInfo').cover
    }
  }
})