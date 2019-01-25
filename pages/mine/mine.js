// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: wx.getStorageSync('userInfo').nick_name,
    avatar: wx.getStorageSync('userInfo').avatar,
    attentionMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 获取订单数量
  getOrderNum(){
    let url = '/api/order/orderStatistics'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data=>{
      this.setData({
        orderNum: data
      })
    })
  },
  // // 关注我们
  // attention(){
  //   this.setData({
  //     attentionMask: true
  //   })
  // },
  // // 关闭关注组件
  // closeAttention(){
  //   this.setData({
  //     attentionMask: false
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderNum()
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

  }
})