// pages/index/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    all:{
      count: 1,
      price: 0,
      postage: 0,
      coin: 0,
      balance: 0,
      totalPrice: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene){ //选择地址后返回
      this.setData({
        scene: options.scene
      })
    }
    this.getDefaultAddress()
    this.getTmpOrder()
  },
  //获取默认地址
  getDefaultAddress(){
    let url ='/api/address/defaultAddress'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data=>{
      this.setData({
        address: data.address
      })
      // 选择地址后返回，覆盖原来地址
      if(this.data.scene==1){
        this.setData({
          address: getApp().globalData.currentAdd
        })
      }
    })
  },
  // 获取临时订单
  getTmpOrder(){
    let url = '/api/order/getTmpOrder'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data=>{
      let goods = data.goods
      goods.forEach(item=>{
        item.price = parseFloat(item.unit_price / 100 + item.design_price / 100).toFixed(2)
        item.unit_price = parseFloat(item.unit_price / 100).toFixed(2)
        item.design_price = parseFloat(item.design_price / 100).toFixed(2)
      })
      this.setData({
        goods: data.goods
      })
      //计算总和
      this.countAll()
    })
  },
  // 获取邮费、余额、串币
  getCost(){
    let url = '/api/order/getCost'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      price: this.data.all.price*100
    }).then(data=>{
      this.data.all.postage = parseFloat(data.express_cost / 100).toFixed(2)
      this.data.all.coin = parseFloat(data.chuan_coin / 100).toFixed(2)
      this.data.all.balance = parseFloat(data.used_account_balance / 100).toFixed(2)
      this.data.all.totalPrice = parseFloat(data.wx_pay / 100).toFixed(2)
      this.setData({
        moneyInfo: data,
        all: this.data.all
      })
    })
  },
  // 数量减
  reduceNum(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.goods[index].count > 1) {
      this.data.goods[index].count--
      this.setData({
        goods: this.data.goods
      })
      //计算总和
      this.countAll()
    }
  },
  // 数量加
  addNum(e) {
    let index = e.currentTarget.dataset.index
    this.data.goods[index].count++
    this.setData({
      goods: this.data.goods
    })
    //计算总和
    this.countAll()
  },
  //计算总和
  countAll(){
    let count = 0
    let price = 0
    this.data.goods.forEach(item=>{
      count = count+parseInt(item.count)
      price = price + parseFloat(item.price) * parseInt(item.count)
    })
    this.data.all.count = count
    this.data.all.price = price
    this.setData({
      all: this.data.all
    })
    // 获取邮费、余额、串币
    this.getCost()
  },
  // 留言
  input(e){
    this.data.goods[e.currentTarget.dataset.index].message = e.detail.value
    this.setData({
      goods: this.data.goods
    })
  },
  // 支付
  pay() {
    if (!this.data.address){
      wx.showToast({
        title: '请选择收货地址',
        image: '/images/tip.png'
      })
    }else{
      let url = '/api/order/settlement'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        address_id: this.data.address.id,
        goods: JSON.stringify(this.data.goods),
        red_id: this.data.moneyInfo.red_id,
        shop: wx.getStorageSync('shop')
      }).then(data=>{
        if (data.need_wx_pay=='yes'){ //需要微信支付=> 调用微信支付
          wx.requestPayment({
            timeStamp: data.pay_param.timeStamp.toString(),
            nonceStr: data.pay_param.nonceStr,
            package: data.pay_param.package,
            signType: data.pay_param.signType,
            paySign: data.pay_param.paySign,
            success: ()=>{ // 支付成功
              wx.redirectTo({
                url: `/pages/index/pay/success/success?id=${data.order_id}&money=${data.order_money}`,
              })
            },
            fail: ()=>{ //支付失败=>跳转至我的订单
              let url = '/api/order/wxPayFailCallback'
              getApp().post(url, {
                token: wx.getStorageSync('auth_token'),
                order_id: data.order_id
              }).then(()=>{
                wx.redirectTo({
                  url: '/pages/mine/order/order?index=0',
                })
              })
            }
          })
        }else{ //余额支付完成
          wx.redirectTo({
            url: `/pages/index/pay/success/success?id=${data.order_id}&money=${data.order_money}`,
          })
        }
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