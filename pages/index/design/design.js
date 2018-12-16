// pages/index/design/design.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    clothes: [], //款式
    colors: [], //颜色样式
    currentColorIndex: 0, //当前颜色index
    currentDirection: 'front_thumb', //正反面
    selectFodder: false, //显示选择素材模块
    fodderTypes: [], //素材分类
    fodderTypeName: '全部素材',//素材分类名称
    fodderTypeId: '', //素材类型id
    fodders: [], //素材
    pageNo: 1, //当前页码
    pageSize: 10, //每页条数
    maxPage: 1, //最大页数
    designImg: [] //图片素材组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.clothesList(this.data.type)
  },
  // 切换服装类型
  tabType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      currentDirection: 'front_thumb'
    })
    // 默认加载男装
    this.clothesList(this.data.type)
  },
  // 完成设计
  confirm() {
    wx.navigateTo({
      url: '/pages/index/detail/detail'
    })
  },
  // 获取衣服款式
  clothesList(type) {
    wx.request({
      url: 'https://cy.nulizhe.com/api/Clothes/clothesList',
      data: {
        type: type
      },
      success: res => {
        if (res.data.code == 1) {
          this.setData({
            clothes: res.data.data.clothes
          })
          // 默认加载第一项的颜色
          this.getStyle(res.data.data.clothes[0].id)
        } else {
          wx.showToast({
            title: res.data.message,
            image: '/images/tip.png'
          })
        }
      }
    })
  },
  // 获取衣服颜色和素材
  getStyle(id) {
    wx.request({
      url: 'https://cy.nulizhe.com/api/Clothes/clothesStyle',
      data: {
        clothes_id: id
      },
      success: res => {
        if (res.data.code == 1) {
          this.setData({
            colors: res.data.data.colors
          })
        } else {
          wx.showToast({
            title: res.data.message,
            images: '/images/tip.png'
          })
        }
      }
    })
  },
  // 切换颜色
  tabColor(e) {
    this.setData({
      currentColorIndex: e.currentTarget.dataset.index
    })
  },
  //切换正反面
  tabDirection(e) {
    if (e.currentTarget.dataset.label == 0) {
      this.setData({
        currentDirection: 'front_thumb'
      })
    } else {
      this.setData({
        currentDirection: 'back_thumb'
      })
    }
  },
  // 点击素材按钮
  showSelectFodder() {
    this.setData({
      selectFodder: true
    })
    // 记载素材分类
    this.getFodderTypes()
    // 默认加载全部素材第一页
    this.getFodders()
  },
  // 点击返回按钮
  backSelectFodder() {
    this.setData({
      selectFodder: false,
      fodderTypeId: '',
      fodderTypeName: '全部素材',
      pageNo: 1,
      maxPage: 1,
      fodders: []
    })
  },
  // 获取素材分类
  getFodderTypes() {
    wx.request({
      url: 'https://cy.nulizhe.com/api/Material/getMaterialTypes',
      success: res => {
        if (res.data.code == 1) {
          this.setData({
            fodderTypes: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            image: '/images/tip.png'
          })
        }
      }
    })
  },
  // 选择素材分类
  selectFodder(e) {
    this.setData({
      fodderTypeId: this.data.fodderTypes[e.detail.value].id,
      fodderTypeName: this.data.fodderTypes[e.detail.value].name,
      pageNo: 1,
      maxPage: 1,
      fodders: []
    })
    // 加载当前分类第一页
    this.getFodders()
  },
  // 加载素材
  getFodders() {
    if (this.data.pageNo <= this.data.maxPage) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: 'https://cy.nulizhe.com/api/Material/getMaterialByType',
        data: {
          type_id: this.data.fodderTypeId,
          page: this.data.pageNo,
          limit: this.data.pageSize
        },
        success: res=>{
          wx.hideLoading()
          if(res.data.code==1){
            this.setData({
              fodders: res.data.data.materials,
              maxPage: res.data.data.total
            })
          }else{
            wx.showToast({
              title: res.data.message,
              image: '/images/tip.png'
            })
          }
        }
      })
    }
  },
  //下一页
  nextPage(){
    this.setData({
      pageNo: this.data.pageNo+1
    })
    this.getFodders()
  },
  // 渲染画布
  draw(){
    const canvas = wx.createCanvasContext('canvas')
  },
  // 选择素材
  pickerFodder(e){
    const canvas = wx.createCanvasContext('canvas')
    wx.showLoading({
      title: '请稍等',
    })
    wx.downloadFile({
      url: this.data.fodders[e.currentTarget.dataset.index].thumb,
      success: res=>{
        wx.hideLoading()
        canvas.clearRect(0,0,100,100)
        canvas.drawImage(res.tempFilePath,0,0,100,100)
        canvas.draw(true, ()=>{
          console.log(123123)
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

  }
})