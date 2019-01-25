// pages/mine/car/car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0, //总价
    checkAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGoodList()
  },
  // 商品列表
  getGoodList() {
    let url = '/api/cart/getCartList'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      let list = data.list
      list.forEach(item => {
        item.goods_price = parseFloat(item.goods_price / 100).toFixed(2)
        item.checked = 0
      })
      this.setData({
        goods: list
      })
      // 计算总价
      this.countTotalPrice()
    })
  },
  // 数量减
  reduceNum(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.goods[index].count > 1) {
      let url = '/api/cart/decCount'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        cart_id: e.currentTarget.dataset.cartid
      }).then(() => {
        this.data.goods[index].count--
          this.setData({
            goods: this.data.goods
          })
        // 计算总价
        this.countTotalPrice()
      })
    }
  },
  // 数量加
  addNum(e) {
    let index = e.currentTarget.dataset.index
    let url = '/api/cart/incCount'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      cart_id: e.currentTarget.dataset.cartid
    }).then(() => {
      this.data.goods[index].count++
        this.setData({
          goods: this.data.goods
        })
      // 计算总价
      this.countTotalPrice()
    })
  },
  // 选择
  radio(e) {
    let index = e.currentTarget.dataset.index
    this.data.goods[index].checked = this.data.goods[index].checked == 1 ? 0 : 1
    this.setData({
      goods: this.data.goods
    })
    // 计算总价
    this.countTotalPrice()
  },
  // 计算总价
  countTotalPrice() {
    let totalPrice = 0
    this.data.goods.forEach(item => {
      if (item.checked == 1) {
        totalPrice = totalPrice + item.goods_price * item.count
      }
    })
    this.setData({
      totalPrice: totalPrice.toFixed(2)
    })
  },
  // 全选
  checkAll() {
    this.data.goods.forEach(item => {
      item.checked = this.data.checkAll ? 0 : 1
    })
    this.setData({
      checkAll: !this.data.checkAll,
      goods: this.data.goods
    })
    // 计算总价
    this.countTotalPrice()
  },
  // 删除
  delete(e) {
    wx.showModal({
      content: '确定移除？',
      success: res => {
        if (res.confirm) {
          let url = '/api/cart/delete'
          let index = e.currentTarget.dataset.index
          wx.showLoading({
            title: '正在移除',
          })
          getApp().post(url, {
            token: wx.getStorageSync('auth_token'),
            cart_id: e.currentTarget.dataset.cartid
          }).then(() => {
            wx.hideLoading()
            wx.showToast({
              title: '移除成功',
            })
            this.data.goods.splice(index, 1)
            this.setData({
              goods: this.data.goods
            })
            // 计算总价
            this.countTotalPrice()
          })
        }
      }
    })
  },
  // 结算
  closing(){
    let cartsArr = []
    this.data.goods.forEach(item=>{
      if(item.checked==1){
        cartsArr.push( item.cart_id )
      }
    })
    let url = '/api/order/cartPost'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      carts: cartsArr.join(',')
    }).then(()=>{
      wx.navigateTo({
        url: '/pages/index/pay/pay',
      })
    })
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