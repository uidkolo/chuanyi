// pages/mine/order/detail/detail.js
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
    this.setData({
      id: options.id
    })
    this.getOrderInfo(options.id)
    if (options.scene == 1) { //来自列表立即支付=>直接调用支付
      this.payOrder()
    }
  },
  // 获取订单详情
  getOrderInfo(id) {
    let url = '/api/order/orderDetail'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: id
    }).then(data => {
      let info = data.detail
      info.all_goods_price = parseFloat(info.all_goods_price / 100).toFixed(2)
      info.express_cost = parseFloat(info.express_cost / 100).toFixed(2)
      info.chuan_coin = parseFloat(info.chuan_coin / 100).toFixed(2)
      info.real_pay = parseFloat(info.real_pay / 100).toFixed(2)
      info.used_account_balance = parseFloat(info.used_account_balance / 100).toFixed(2)
      info.used_wx_pay = parseFloat(info.used_wx_pay / 100).toFixed(2)
      info.can_used_balance = parseFloat(info.can_used_balance / 100).toFixed(2)
      info.need_wx_pay = parseFloat(info.need_wx_pay / 100).toFixed(2)
      info.goods.forEach(item => {
        item.price = parseFloat(item.price / 100).toFixed(2)
      })
      this.setData({
        info: info
      })
    })
  },
  // 立即支付
  payOrder() {
    let url = '/api/order/payOrder'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: this.data.id
    }).then(data => {
      if (data.need_wx_pay == 'yes') { //需要微信支付=> 调用微信支付
        wx.requestPayment({
          timeStamp: data.pay_param.timeStamp.toString(),
          nonceStr: data.pay_param.nonceStr,
          package: data.pay_param.package,
          signType: data.pay_param.signType,
          paySign: data.pay_param.paySign,
          success: () => { // 支付成功
            wx.redirectTo({
              url: `/pages/index/pay/success/success?id=${data.order_id}&money=${data.order_money}`,
            })
          },
          fail: () => { //支付失败=>跳转至我的订单
            wx.showLoading({
              title: '正在取消',
            })
            let url = '/api/order/wxPayFailCallback'
            getApp().post(url, {
              token: wx.getStorageSync('auth_token'),
              order_id: data.order_id
            }).then(() => {
              wx.hideLoading()
              wx.redirectTo({
                url: '/pages/mine/order/order?index=0',
              })
            })
          }
        })
      } else { //余额支付完成
        wx.redirectTo({
          url: `/pages/index/pay/success/success?id=${data.order_id}&money=${data.order_money}`,
        })
      }
    })
  },
  //查看物流
  previewExpress(){
    if (this.data.info.status != 0 && this.data.info.status != 1){
      wx.navigateTo({
        url: `/pages/mine/order/express/express?id=${this.data.id}`,
      })
    }
  },
  // 取消订单
  cancelOrder() {
    wx.showModal({
      content: '确定取消订单？',
      success: res => {
        if (res.confirm) {
          let url = '/api/order/cancelOrder'
          getApp().post(url, {
            token: wx.getStorageSync('auth_token'),
            order_id: this.data.id
          }).then(() => {
            wx.showToast({
              title: '取消成功',
            })
            wx.navigateBack()
          })
        }
      }
    })
  },
  // 提醒发货
  remindSend() {
    let url = '/api/order/remindSend'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: this.data.id
    }).then(() => {
      wx.showToast({
        title: '提醒成功',
      })
    })
  },
  // 确认收货
  comfireTake() {
    wx.showModal({
      title: '收货提醒',
      content: '请确认收到货物后再确认收货！',
      success: res => {
        if (res.confirm) {
          let url = '/api/order/confirmReceipt'
          getApp().post(url, {
            token: wx.getStorageSync('auth_token'),
            order_id: this.data.id
          }).then(() => {
            wx.showToast({
              title: '收货成功',
            })
            wx.navigateBack()
          })
        }
      }
    })
  },
  // 复制订单编号
  copyOrderNum(){
    wx.setClipboardData({
      data: this.data.info.order_number,
      success: ()=>{
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 申请售后
  afterSale(e){
    // url = '/pages/mine/order/afterSale/afterSale?id={{item.id}}'
    let id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    if(status==1){
      wx.navigateTo({
        url: `/pages/mine/order/afterSale/afterSale?id=${id}`,
      })
    }else{ //=>跳售后列表
      wx.navigateTo({
        url: `/pages/mine/afterSale/afterSale`,
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