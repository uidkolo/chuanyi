// pages/index/getWallet/getWallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRed:false,
    init: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id!=undefined){ //分享入口
      this.setData({
        money: options.money,
        time: options.time,
        id: options.id
      })
      getApp().globalData.shareRed = {
        money: options.money,
        time: options.time,
        id: options.id
      }
    }else{ //登录返回
      this.setData({
        money: getApp().globalData.shareRed.money,
        time: getApp().globalData.shareRed.time,
        id: getApp().globalData.shareRed.id
      })
    }
   
  },
  // 领取红包
  getRed() {
    let url = '/api/red_packet/receiveFriendRedPacket'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      red_id: this.data.id
    }).then(() => {
      this.setData({
        showRed: true
      })
    })
  },
  // 获取推荐
  getRecommends() {
    let url = '/api/works_site/recommendWorks'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        recommends: data.list
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
    if(this.data.init){
      // 登录验证
      getApp().init(() => {
        this.setData({
          init: false
        })
        // 领取分享红包
        this.getRed()
        // 获取推荐
        this.getRecommends()
      })
    }
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