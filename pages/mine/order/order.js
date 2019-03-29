// pages/mine/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end: false,
    tabIndex: '',
    orders: [],
    pageNo: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.index) {
      this.setData({
        tabIndex: options.index
      })
    }
  },
  // tab
  tab(event) {
    this.setData({
      tabIndex: event.currentTarget.dataset.index,
      orders: [],
      pageNo: 1,
      totalPage: 1,
      end: false
    })
    this.getOrders()
  },
  // 获取订单
  getOrders() {
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/Order/orderList'
      if (this.data.tabIndex === "") {
        var data = {
          token: wx.getStorageSync('auth_token'),
          page: this.data.pageNo
        }
      } else {
        var data = {
          token: wx.getStorageSync('auth_token'),
          page: this.data.pageNo,
          status: this.data.tabIndex
        }
      }

      getApp().post(url, data).then(data => {
        wx.hideLoading()
        let orders = data.orders
        orders.forEach(item => {
          item.all_goods_price = parseFloat(item.all_goods_price / 100).toFixed(2)
          item.goods.forEach(item2 => {
            item2.price = parseFloat(item2.price / 100).toFixed(2)
          })
        })
        this.data.orders = this.data.orders.concat(orders)
        this.setData({
          orders: this.data.orders,
          pageNo: this.data.pageNo + 1,
          totalPage: data.total
        })
        if (this.data.pageNo - 1 == this.data.totalPage || data.total == 0) {
          this.setData({
            end: true
          })
        }
      })
    }
  },
  // 取消订单
  cancelOrder(e) {
    wx.showModal({
      content: '确定取消订单？',
      success: res => {
        if (res.confirm) {
          let url = '/api/order/cancelOrder'
          getApp().post(url, {
            token: wx.getStorageSync('auth_token'),
            order_id: e.currentTarget.dataset.id
          }).then(() => {
            wx.showToast({
              title: '取消成功',
            })

            this.setData({
              orders: [],
              pageNo: 1,
              totalPage: 1,
              end: false
            })
            this.getOrders()
          })
        }
      }
    })
  },
  // 提醒发货
  remindSend(e) {
    let url = '/api/order/remindSend'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: e.currentTarget.dataset.id
    }).then(() => {
      wx.showToast({
        title: '提醒成功',
      })
    })
  },
  // 确认收货
  comfireTake(e) {
    wx.showModal({
      title: '收货提醒',
      content: '请确认收到货物后再确认收货！',
      success: res => {
        if (res.confirm) {
          let url = '/api/order/confirmReceipt'
          getApp().post(url, {
            token: wx.getStorageSync('auth_token'),
            order_id: e.currentTarget.dataset.id
          }).then(() => {
              wx.showToast({
                title: '收货成功',
              })

              this.setData({
                orders: [],
                pageNo: 1,
                totalPage: 1,
                end: false
              })
              this.getOrders()
          })
        }
      }
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
    this.setData({
      orders: [],
      pageNo: 1,
      totalPage: 1,
      end: false
    })
    this.getOrders()
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
    this.getOrders()
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