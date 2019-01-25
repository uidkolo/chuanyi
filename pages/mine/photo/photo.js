// pages/mine/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end: false,
    tabIndex: '',
    designs: [],
    pageNo: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDesigns()
  },
  // 获取我的作品
  getDesigns(){
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/Design/getUserDesigns'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        let designs = data.designs
        this.data.designs = this.data.designs.concat(designs)
        this.setData({
          designs: this.data.designs,
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
    this.getDesigns()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})