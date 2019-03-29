// pages/works/applyJoin/applyJoin.js
const uploadImage = require('../../../utils/uploadFile.js')
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: 60,
    haveMobile: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      let mobile = wx.getStorageSync('userInfo').mobile
      if(mobile){
        this.setData({
          haveMobile: true,
          mobile: mobile
        })
      }
  },
  // input
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  //uploadImg
  uploadImg(e){
    wx.chooseImage({
      success: (res)=> {
        this.upload(res.tempFilePaths[0]).then(url => {
          this.setData({
            [e.currentTarget.dataset.key]: url
          })
        })
      },
    })
  },
  //上传图片
  upload: function (file) {
    return new Promise((resolve, reject) => {
      var nowTime = util.formatTime(new Date());
      uploadImage(file, 'images/' + nowTime + '/',
        function (result) {
          resolve(result)
        },
        function (result) {
          console.log("======上传失败======", result);
        }
      )
    })
  },
  // 提交申请
  apply(){
    if (!this.data.name){
      wx.showToast({
        title: '请输入姓名',
        image: '/images/tip.png'
      })
    } else if (!this.data.identity_number){
      wx.showToast({
        title: '请输入身份证号',
        image: '/images/tip.png'
      })
    } else if (!this.data.mobile){
      wx.showToast({
        title: '请输入手机号',
        image: '/images/tip.png'
      })
    } else if (!this.data.identity_front || !this.data.identity_back){
      wx.showToast({
        title: '请上传身份证',
        image: '/images/tip.png'
      })
    } else if (!this.data.original_pic || !this.data.original_design){
      wx.showToast({
        title: '请上传原创稿',
        image: '/images/tip.png'
      })
    } else{
      wx.showLoading({
        title: '正在提交',
      })
      let url = '/api/Designer/apply'
      let mobile = wx.getStorageSync('userInfo').mobile
      if (!mobile) {
        var data = {
          token: wx.getStorageSync('auth_token'),
          name: this.data.name,
          identity_number: this.data.identity_number,
          identity_front: this.data.identity_front,
          identity_back: this.data.identity_back,
          original_pic: this.data.original_pic,
          original_design: this.data.original_design,
          mobile: this.data.mobile,
          code: this.data.code
        }
      }else{
        var data = {
          token: wx.getStorageSync('auth_token'),
          name: this.data.name,
          identity_number: this.data.identity_number,
          identity_front: this.data.identity_front,
          identity_back: this.data.identity_back,
          original_pic: this.data.original_pic,
          original_design: this.data.original_design
        }
      }
      getApp().post(url, data).then(data=>{
        wx.hideLoading()
        wx.showModal({
          content: '提交成功！等待平台审核',
        })
      })
    }
  },
  // 获取验证码
  getCode() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号',
        image: '/images/tip.png'
      })
    } else if (this.data.mobile.length != 11) {
      wx.showToast({
        title: '手机格式错误',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/sms/sendSms'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        mobile: this.data.mobile
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
      setTimeout(this.timer, 1000)
    } else {
      this.setData({
        codeStatus: false,
        timer: 60
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