// pages/mine/order/express/express.js
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
    this.getExpress(options.id)
  },
  // 获取快递信息
  getExpress(id){
    let url = '/api/order/seeLogistics'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: id
    }).then(data=>{
      this.setData({
        info:data
      })
    })
  },
  // 复制单号
  copy(){
    wx.setClipboardData({
      data: this.data.info.express_number.toString(),
      success: ()=>{
        wx.showToast({
          title: '复制成功',
        })
      }
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

  }
})