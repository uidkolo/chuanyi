// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPreRoute()
  },
  // 获取上一个页面路径
  getPreRoute() {
    var pages = getCurrentPages() //获取加载的页面
    var prePage = pages[pages.length - 2] //获取上一个页面的对象
    if (prePage) {
      var url = prePage.route //上一个页面url
      this.setData({
        prePage: url
      })
    } else {
      this.setData({
        prePage: 'pages/index/index'
      })
    }
  },
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo
      let url = '/api/User/setUserInfo'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        nick_name: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        gender: userInfo.gender,
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country,
        invite: wx.getStorageSync('invite'),
        shop: wx.getStorageSync('shop')
      }).then(data => {
        wx.reLaunch({
          url: `/${this.data.prePage}`,
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