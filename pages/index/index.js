// pages/design/design.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    currentOrderIndex: 0,
    init: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 邀新
    if (options.invite){
      wx.setStorageSync('invite', options.invite)
    }
    // 商家推广
    if (options.scene) {
      wx.setStorageSync('shop', options.scene)
    }
  },
  // swiper
  swiper(event) {
    this.setData({
      currentIndex: event.detail.current
    })
  },
  // 获取轮播
  getBanners() {
    let url = '/api/Picture/indexImgs'
    getApp().get(url).then(data => {
      this.setData({
        banners: data.imgs
      })
    })
  },
  // 获取订单轮播
  getOrderInfo() {
    let url = '/api/public/orders'
    getApp().get(url).then(data => {
      this.setData({
        orders: data.list
      })
      setTimeout(this.animation, 2000)
    })
  },
  // timer
  timer() {
    if (this.data.currentOrderIndex < 4) {
      this.data.currentOrderIndex = this.data.currentOrderIndex + 1
    } else {
      this.data.currentOrderIndex = 0
    }
    this.setData({
      currentOrderIndex: this.data.currentOrderIndex,
      currentOrder: this.data.orders[this.data.currentOrderIndex]
    })
  },
  // 动画
  animation() {
    const animation = wx.createAnimation({
      duration: '1000',
      timingFunction: 'ease',
      delay: '1000'
    })
    animation.left('30rpx').step()
    animation.left('-500rpx').step()
    this.setData({
      animation: animation.export()
    })
    this.timer()
    setTimeout(this.animation, 5000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if(this.data.init){
      // 登录验证
      getApp().init(() => {
        this.setData({
          init: false
        })
        this.getBanners() //获取banner
        this.getOrderInfo() //获取订单信息
      })
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
    return{
      title: wx.getStorageSync('shareInfo').word,
      path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
      imageUrl: wx.getStorageSync('shareInfo').cover
    }
  }
})