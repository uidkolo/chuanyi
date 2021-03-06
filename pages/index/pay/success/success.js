// pages/index/pay/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: parseFloat(options.money / 100).toFixed(2),
      orderId: options.id
    })
    this.createRed(options.id)
  },
  createRed(orderId){
    let url = '/api/red_packet/getNewRedPacket'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: orderId
    }).then(data=>{
      this.setData({
        redId: data.red_info.red_id,
        redName: data.red_info.name
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一起瓜分，看谁手气最好！',
      path: `/pages/index/getRed/getRed?id=${this.data.redId}`,
      imageUrl: '/images/pay/pull.png'
    }
  }
})