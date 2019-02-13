// pages/works/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: '',
    searched: false,
    end: false,
    designs: [],
    pageNo: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHots()
    this.getKinds()
    this.getRecommends()
  },
  // 热搜
  tabHot(e){
    this.setData({
      keyword: e.currentTarget.dataset.key
    })
    this.search()
  },
  // 搜索
  search() {
    if (!this.data.keyword) {
      wx.showToast({
        title: '请输入关键字',
        image: '/images/tip.png'
      })
    } else {
      this.setData({
        searched: true
      })
      this.getSearchs()
    }
  },
  //获取搜索
  getSearchs(){
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/works_site/worksSearchList'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        kind: this.data.kind,
        keyword: this.data.keyword,
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
  //tab
  tab(e){
    this.setData({
      kind: e.currentTarget.dataset.id,
      end: false,
      designs: [],
      pageNo: 1,
      totalPage: 1
    })
    this.getSearchs()
  },
  // 获取热词
  getHots() {
    let url = '/api/works_site/searchHotKeyword'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        hots: data.hot_keyword
      })
    })
  },
  //input
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  // 获取服装种类
  getKinds() {
    let url = '/api/clothes/clothesKinds'
    getApp().get(url).then(data => {
      this.setData({
        kinds: data.kinds,
        kind: data.kinds[0].id
      })
    })
  },
  // 获取推荐
  getRecommends() {
    let url = '/api/works_site/recommendWorks'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        recommends: data.list
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
    this.getSearchs()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})