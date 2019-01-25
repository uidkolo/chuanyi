// pages/mine/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end: false,
    tabIndex: '',
    reds: [],
    pageNo: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRedList()
  },
  // 获取串币
  getRedList(){
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/red_packet/getUserRedPacketList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        page: this.data.pageNo,
        status: this.data.tabIndex
      }).then(data => {
        wx.hideLoading()
        let reds = data.list
        reds.forEach(item => {
          item.money = parseFloat(item.money / 100).toFixed(2)
        })
        this.data.reds = this.data.reds.concat(reds)
        this.setData({
          reds: this.data.reds,
          pageNo: this.data.pageNo + 1,
          totalPage: data.total,
          can_use_count: data.can_use_count,
          used_count: data.used_count,
          overdue_count: data.overdue_count
        })
        if (this.data.pageNo - 1 == this.data.totalPage || data.total == 0) {
          this.setData({
            end: true
          })
        }
      })
    }
  },
  // tab
  tab(e){
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      reds: [],
      pageNo: 1,
      totalPage: 1,
      end: false
    })
    this.getRedList()
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
    this.getRedList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return{
      title: '收到好友的串币红包',
      path: `/pages/index/index?scene=2&id=${e.target.dataset.id}`
    }
  }
})