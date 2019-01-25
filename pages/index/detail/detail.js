// pages/index/design/design.js
const WxParse = require('../../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 1,
    cartNum: 0,
    currentContentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取购物车数量
    this.getCartNum()

    // 获取商品信息
    this.getGoodInfo(options.id).then(info => {
      info.max_money = parseFloat(info.max_money / 100).toFixed(2)
      info.min_money = parseFloat(info.min_money / 100).toFixed(2)
      info.fabrics.forEach(item=>{
        item.price = parseFloat(item.price / 100).toFixed(2)
      })
      this.setData({
        info: info
      })
      WxParse.wxParse('detail', 'html', info.clothes.detail, this, 20)
    })
  },
  // 获取购物车数量
  getCartNum(){
    let url = '/api/cart/getCartTotal'
    getApp().post(url,{
      token: wx.getStorageSync('auth_token')
    }).then(data=>{
      this.setData({
        cartNum: data.cart_total
      })
    })
  },
  // 获取商品信息
  getGoodInfo(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://cy.nulizhe.com/api/Order/goodsInfo',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: {
          token: wx.getStorageSync('auth_token'),
          design_id: id
        },
        success: res => {
          if (res.data.code == 1) {
            resolve(res.data.data)
          } else {
            wx.showToast({
              title: res.data.message,
              image: '/images/tip.png'
            })
          }
        }
      })
    })
  },
  // 点击选择规格
  pickSizes() {
    this.setData({
      infoMask: true
    })
  },
  // 关闭选择规格
  close() {
    this.setData({
      infoMask: false
    })
  },
  // 选择面料
  pickerFabric(e) {
    this.setData({
      fabricId: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price
    })
  },
  // 选择规格
  pickerSize(e) {
    this.setData({
      size: e.currentTarget.dataset.size
    })
  },
  // 数量减
  reduceNum() {
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number - 1
      })
    }
  },
  // 数量加
  addNum() {
    this.setData({
      number: this.data.number + 1
    })
  },
  // 加入购物车
  addToCar() {
    let url = '/api/cart/addToCart'
    if (!this.data.fabricId) {
      wx.showToast({
        title: '请选择面料',
        image: '/images/tip.png'
      })
    } else if (!this.data.size) {
      wx.showToast({
        title: '请选择规格',
        image: '/images/tip.png'
      })
    } else {
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        clothes_id: this.data.info.clothes.id,
        fabric: this.data.fabricId,
        size: this.data.size,
        count: this.data.number,
        design_pic: this.data.info.design.id
      }).then(data => {
        console.log(data)
        if (data.is_new=='yes'){
          this.setData({
            cartNum: this.data.cartNum + 1,
            infoMask: false
          })
        }else{
          this.setData({
            infoMask: false
          })
        }
        wx.showToast()
      })
    }
  },
  // 提交定制
  confirm() {
    let url = '/api/order/postOrder'
    if (!this.data.fabricId) {
      wx.showToast({
        title: '请选择面料',
        image: '/images/tip.png'
      })
    } else if (!this.data.size) {
      wx.showToast({
        title: '请选择规格',
        image: '/images/tip.png'
      })
    } else {
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        clothes_id: this.data.info.clothes.id,
        fabric: this.data.fabricId,
        size: this.data.size,
        count: this.data.number,
        design_pic: this.data.info.design.id
      }).then(data => {
        wx.navigateTo({
          url: '/pages/index/pay/pay'
        })
      })
    }
  },
  // 切换详情区域
  tabContent(e){
    this.setData({
      currentContentIndex: e.currentTarget.dataset.index
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