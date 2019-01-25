// pages/mine/cooperation/cooperation.js
const uploadImage = require('../../../utils/uploadFile.js')
const util = require('../../../utils/util.js')
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
    this.getIndustrys()
  },
  // 获取行业数据
  getIndustrys() {
    let url = '/api/Cooperation/getIndustry'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      let industrys = data.industries
      let arr = []
      for (let i in industrys) {
        arr.push({
          key: i,
          name: industrys[i]
        })
      }
      this.setData({
        industrys: arr
      })
    })
  },
  // 输入
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  //选择省市区
  pickerAdd(e) {
    let value = e.detail.value
    this.setData({
      province: value[0],
      city: value[1],
      area: value[2]
    })
  },
  //选择行业
  pickerIndustry(e) {
    let value = e.detail.value
    this.setData({
      industry: parseInt(value) + 1
    })
  },
  // 选择图片
  chooseImg(e) {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.uploadImg(res.tempFilePaths[0]).then(url => {
          this.setData({
            license: url
          })
        })
      },
    })
  },
  //上传图片
  uploadImg: function(file) {
    return new Promise((resolve, reject) => {
      var nowTime = util.formatTime(new Date());
      uploadImage(file, 'images/' + nowTime + '/',
        function(result) {
          resolve(result)
        },
        function(result) {
          console.log("======上传失败======", result);
        }
      )
    })
  },
  // 我要合作
  apply(){
    if (!this.data.company){
      wx.showToast({
        title: '请输入企业名称',
        image:'/images/tip.png'
      })
    } else if (!this.data.leading_official){
      wx.showToast({
        title: '请输入企业负责人',
        image: '/images/tip.png'
      })
    } else if (!this.data.tel){
      wx.showToast({
        title: '请输入联系电话',
        image: '/images/tip.png'
      })
    }else if(!this.data.area){
      wx.showToast({
        title: '请选择省市区',
        image: '/images/tip.png'
      })
    } else if (!this.data.address){
      wx.showToast({
        title: '请填写地址',
        image: '/images/tip.png'
      })
    } else if (!this.data.industry){
      wx.showToast({
        title: '请选择行业',
        image: '/images/tip.png'
      })
    } else if (!this.data.license){
      wx.showToast({
        title: '请上传营业执照',
        image: '/images/tip.png'
      })
    }else{
      wx.showLoading({
        title: '正在申请',
      })
      let url = '/api/Cooperation/apply'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        company: this.data.company,
        leading_official: this.data.leading_official,
        tel: this.data.tel,
        province: this.data.province,
        city: this.data.city,
        area: this.data.area,
        address: this.data.address,
        industry: this.data.industry,
        license: this.data.license
      }).then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '申请成功！',
        })
        this.setData({
          company: '',
          leading_official: '',
          tel: '',
          province: '',
          city: '',
          area: '',
          address: '',
          industry: '',
          license: ''
        })
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