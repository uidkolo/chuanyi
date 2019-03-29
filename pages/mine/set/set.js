// pages/mine/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobileValue: '',
    timer: 60,
    mask: false
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mobile: wx.getStorageSync('userInfo').mobile,
      avatar: wx.getStorageSync('userInfo').avatar,
      name: wx.getStorageSync('userInfo').nick_name
    })
    this.getUserInfo()
  },
  // input
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  // 获取验证码
  getCode() {
    if (!this.data.mobileValue) {
      wx.showToast({
        title: '请输入手机号',
        image: '/images/tip.png'
      })
    } else if (this.data.mobileValue.length != 11) {
      wx.showToast({
        title: '手机格式错误',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/sms/sendSms'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        mobile: this.data.mobileValue
      }).then(() => {
        this.setData({
          codeStatus: true
        })
        setTimeout(this.timer, 1000)
      })
    }
  },
  // 倒计时
  timer() {
    if (this.data.timer > 1) {
      this.setData({
        timer: this.data.timer - 1
      })
      setTimeout(this.timer,1000)
    } else {
      this.setData({
        codeStatus: false,
        timer:60
      })
    }
  },
  // 点击绑定手机
  bindMobile(){
    this.setData({
      mask: true
    })
  },
  // 取消
  cancel(){
    this.setData({
      mask: false
    })
  },
  // 绑定
  confirm(){
    if (!this.data.mobileValue){
      wx.showToast({
        title: '请输入手机号',
        image: '/images/tip.png'
      })
    } else if (this.data.mobileValue.length != 11) {
      wx.showToast({
        title: '手机格式错误',
        image: '/images/tip.png'
      })
    }else if(!this.data.code){
      wx.showToast({
        title: '请输入验证码',
        image: '/images/tip.png'
      })
    }else{
      let url = '/api/User/bindMobile'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        mobile: this.data.mobileValue,
        code: this.data.code
      }).then(data=>{
        wx.showToast({
          title: '绑定成功',
        })
        this.getUserInfo()
        this.setData({
          mobile: data,
          mask: false,
          timer: 60,
          codeStatus: false
        })
      })
    }
  },
  // 获取用户信息
  getUserInfo(){
    let url = '/api/User/getUserInfo'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data=>{
      wx.setStorageSync('userInfo', data)
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
    return {
      title: wx.getStorageSync('shareInfo').word,
      path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
      imageUrl: wx.getStorageSync('shareInfo').cover
    }
  }
})