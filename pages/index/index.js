// pages/design/design.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    list:[
      {
        title: "为所爱，做心衣"
      },
      {
        title: "为所爱，做心衣"
      },
      {
        title: "为所爱，做心衣"
      },
      {
        title: "为所爱，做心衣"
      },
      {
        title: "为所爱，做心衣"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.scene==2){ // =>赠送红包入口

    }
    this.getBanners() //获取banner
  },
  // swiper
  swiper(event){
    this.setData({
      currentIndex: event.detail.current
    })
  },
  // 获取轮播
  getBanners(){
    let url = '/api/Picture/indexImgs'
    getApp().get(url).then(data=>{
      this.setData({
        banners: data.imgs
      })
    })
  },
  // 领取赠送红包
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