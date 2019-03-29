// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attentionMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nickname: wx.getStorageSync('userInfo').nick_name,
      avatar: wx.getStorageSync('userInfo').avatar
    })

    this.getMessages()
  },
  // 获取订单数量
  getOrderNum() {
    let url = '/api/order/orderStatistics'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        orderNum: data
      })
    })
  },
  // 获取我关注的人数
  getAttentionNum() {
    let url = '/api/user/getFollowCount'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        attentionNum: data.follow_count,
        unSeeRedNum: data.un_see_red,
        unSeeDesignNum: data.un_see_design
      })
    })
  },
  // 获取系统消息
  getMessages() {
    wx.showLoading({
      title: '正在加载',
    })
    let url = '/api/message/systemMessage'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      wx.hideLoading()
      this.setData({
        messages: data.list
      })
    })
  },
  // 设计师审核状态
  auditStatus() {
    let url = '/api/designer/applyDesignerResult'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        auditStatus: data.status
      })
    })
  },
  // 进入我的作品
  toMyWork() {
    let status = this.data.auditStatus
    if (status == 0) { //未申请=>申请页面
      wx.navigateTo({
        url: '/pages/works/applyJoin/applyJoin',
      })
    } else if (status == 1) { //审核中
      wx.showToast({
        title: '审核中',
        image: '/images/tip.png'
      })
    } else if (status == 2) { // 通过=> 我的作品
      wx.navigateTo({
        url: '/pages/works/myWorks/myWorks',
      })
    } else if (status == 3) { //未通过 =>申请页面
      wx.navigateTo({
        url: '/pages/works/applyJoin/applyJoin',
      })
    }
  },
  // // 关注我们
  // attention(){
  //   this.setData({
  //     attentionMask: true
  //   })
  // },
  // // 关闭关注组件
  // closeAttention(){
  //   this.setData({
  //     attentionMask: false
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOrderNum()
    this.getAttentionNum()
    this.auditStatus()
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
  onShareAppMessage: function(res) {
    if(res.from == 'menu'){
      return {
        title: wx.getStorageSync('shareInfo').word,
        path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
        imageUrl: wx.getStorageSync('shareInfo').cover
      }
    }else{
      return {
        title: wx.getStorageSync('shareInfo').word,
        path: '/pages/index/index?invite='+ wx.getStorageSync('userInfo').id,
        imageUrl: wx.getStorageSync('shareInfo').cover
      }
    }
   
  }
})