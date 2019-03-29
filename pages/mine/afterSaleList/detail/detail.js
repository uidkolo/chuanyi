// pages/mine/afterSaleList/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressValue: '选择物流公司',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      return_id: options.id
    })
    this.getGoodsInfo(options.id)
  },
  //获取商品详情
  getGoodsInfo(id){
    let url = '/api/goods_return/goodsReturnDetail'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      return_id: id
    }).then(data=>{
      let info = data.return_info
      let arr = []
      for (let i in info.common_express_company){
        arr.push({
          label: i,
          value: info.common_express_company[i]
        })
      }
      info.common_express_company = arr
      this.setData({
        info: info
      })
    })
  },
  // 选择物流公司
  pickerExpress(e){
    this.setData({
      code: this.data.info.common_express_company[(e.detail.value)].label,
      expressValue: this.data.info.common_express_company[(e.detail.value)].value,
    })
  },
  // input
  input(e){
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  // 提交物流信息
  postExpressInfo(){
    if (!this.data.code){
      wx.showToast({
        title: '选择物流公司',
        image: '/images/tip.png'
      })
    }else if(!this.data.number){
      wx.showToast({
        title: '请填写单号',
        image: '/images/tip.png'
      })
    }else if(!this.data.tel){
      wx.showToast({
        title: '请填写手机号',
        image: '/images/tip.png'
      })
    }else{
      let url ='/api/goods_return/fillExpressInfo'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        return_id: this.data.return_id,
        code: this.data.code,
        number: this.data.number,
        tel: this.data.tel
      }).then(()=>{
        wx.redirectTo({
          url: '/pages/mine/afterSaleList/afterSaleList',
        })
      })
    }
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
      title: wx.getStorageSync('shareInfo').word,
      path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
      imageUrl: wx.getStorageSync('shareInfo').cover
    }
  }
})