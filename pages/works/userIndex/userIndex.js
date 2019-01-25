// pages/works/userIndex/userIndex.js
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
  onLoad: function(options) {
    this.getUserInfo(options.id)
    this.getDesigns(options.id)
  },
  // 获取设计师信息
  getUserInfo(id){
    let url = '/api/works_site/getDesignerInfo'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      designer_id: id
    }).then(data=>{
      this.setData({
        info: data.designer_info
      })
    })
  },
  // 获取作品
  getDesigns(id) {
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/works_site/worksList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        designer_id: id,
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        let designs = data.works
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
  // 关注或取关
  followOrCancel(e) {
    let url = '/api/works_site/followOrCancel'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      designer_id: this.data.info.id
    }).then(() => {
      wx.showToast({
        title: this.data.info.is_follow == 0 ? '关注成功' : '取关成功',
      })
      this.data.info.is_follow = this.data.info.is_follow  == 0 ? 1 : 0
      this.setData({
        info: this.data.info
      })
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

  }
})