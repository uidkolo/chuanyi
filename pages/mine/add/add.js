// pages/mine/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addMask: false,
    edit: false,
    mobileFocus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene){ //来自临时订单页面
      this.setData({
        scene: options.scene
      })
    }
    this.getAdds()
  },
  // 获取地址列表
  getAdds() {
    let url = '/api/Address/getUserAddressList'
    wx.showLoading({
      title: '正在记载',
    })
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      wx.hideLoading()
      this.setData({
        adds: data.list
      })
    })
  },
  // 修改默认
  setDefault(e) {
    let url = '/api/Address/setDefaultAddress'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      address_id: e.detail.value
    })
  },
  // 新增地址
  add() {
    this.setData({
      recipients: '',
      mobile: '',
      province: '',
      city: '',
      area: '',
      detail: '',
      addMask: true,
      edit: false
    })
  },
  // 取消
  cancel() {
    this.setData({
      addMask: false
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
  // 保存地址
  saveAdd(e) {
    if (!this.data.recipients) {
      wx.showToast({
        title: '请输入姓名',
        image: '/images/tip.png'
      })
    } else if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号',
        image: '/images/tip.png'
      })
    } else if (!this.data.area) {
      wx.showToast({
        title: '请选择省市',
        image: '/images/tip.png'
      })
    } else if (!this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        image: '/images/tip.png'
      })
    } else {
      if (e.currentTarget.dataset.type == 1) { //新增
        let url = '/api/Address/addAddress'
        getApp().post(url, {
          token: wx.getStorageSync('auth_token'),
          recipients: this.data.recipients,
          mobile: this.data.mobile,
          province: this.data.province,
          city: this.data.city,
          area: this.data.area,
          detail: this.data.detail
        }).then(() => {
          this.setData({
            recipients: '',
            mobile: '',
            province: '',
            city: '',
            area: '',
            detail: '',
            addMask: false
          })
          // 重新加载地址列表
          this.getAdds()
        }).catch(()=>{
          this.setData({
            mobileFocus: true
          })
        })
      } else { //更新
        let url = '/api/Address/updateAddress'
        getApp().post(url, {
          token: wx.getStorageSync('auth_token'),
          address_id: this.data.currentAddId,
          recipients: this.data.recipients,
          mobile: this.data.mobile,
          province: this.data.province,
          city: this.data.city,
          area: this.data.area,
          detail: this.data.detail
        }).then(()=>{
          this.setData({
            recipients: '',
            mobile: '',
            province: '',
            city: '',
            area: '',
            detail: '',
            addMask: false
          })
          // 重新加载地址列表
          this.getAdds()
        })
      }

    }
  },
  // 编辑地址
  bindtapEdit(e) {
    let index = e.currentTarget.dataset.index
    let add = this.data.adds[index]
    this.setData({
      currentAddId: add.id,
      recipients: add.recipients,
      mobile: add.mobile,
      province: add.province,
      city: add.city,
      area: add.area,
      detail: add.detail,
      addMask: true,
      edit: true
    })
  },
  // 删除地址
  deleteAdd(e){
    wx.showModal({
      content: '确定删除？',
      success: res=>{
        if(res.confirm){
          let url = '/api/Address/deleteAddress'
          getApp().post(url,{
            token: wx.getStorageSync('auth_token'),
            address_id: e.currentTarget.dataset.id
          }).then(()=>{
            // 重新加载地址列表
            this.getAdds()
          })
        }
      }
    })
  },
  // 选择地址
  checkAdd(e){
    if(this.data.scene==1){
      getApp().globalData.currentAdd = this.data.adds[e.currentTarget.dataset.index]
      wx.redirectTo({
        url: '/pages/index/pay/pay?scene=1',
      })
    }
  },
  // 导入微信地址
  addWechat(){
    wx.chooseAddress({
      success: res=>{
        console.log(res)
        let url = '/api/Address/addAddress'
        getApp().post(url, {
          token: wx.getStorageSync('auth_token'),
          recipients: res.userName,
          mobile: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          area: res.countyName,
          detail: res.detailInfo
        }).then(() => {
          // 重新加载地址列表
          this.getAdds()
        }).catch(() => {
          this.setData({
            mobileFocus: true
          })
        })
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