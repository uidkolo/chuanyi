// pages/mine/favorite/favorite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: '全部类目',
    kindId: '',
    end: false,
    favorites: [],
    pageNo: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKinds()
    this.getFavorite()
  },
  // 获取分类
  getKinds(){
    let url ='/api/clothes/clothesKinds'
    getApp().get(url).then(data=>{
      this.setData({
        kinds: data.kinds
      })
    })
  },
  // 选择类目
  pickerKind(e){
    this.setData({
      kindId: parseInt(e.detail.value) + 1,
      kind: this.data.kinds[e.detail.value].name,
      favorites: [],
      pageNo: 1,
      totalPage: 1
    })
    this.getFavorite()
  },
  // 获取我的收藏
  getFavorite(){
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/favorite/myFavorite'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        clothes_kind: this.data.kindId,
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        let favorites = data.favorite
        this.data.favorites = this.data.favorites.concat(favorites)
        this.setData({
          favorites: this.data.favorites,
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
    this.getFavorite()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})