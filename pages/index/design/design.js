// pages/index/design/design.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notNull: false, //画布为空？
    type: 1, //衣服分类 1:男装 2:女装 3:童装
    clothes: [], //款式
    colors: [], //颜色样式
    currentColorIndex: 0, //当前颜色index
    currentDirection: 'front_thumb', //正反面
    fodderStep: 0, //素材操作阶段
    fodderTypes: [], //素材分类
    fodderTypeName: '全部素材', //素材分类名称
    fodderTypeId: '', //素材类型id
    fodders: [], //素材
    currentFodderPage: 0, //当前素材页码
    pageNo: 1, //当前页码
    pageSize: 2, //每页条数
    maxPage: 1, //最大页数
    designImg: [], //图片素材组
    fodderObject: [], //画布上的素材对象
    startX: 0, //触摸开始点x
    startY: 0, //触摸开始点y
    moveX: 0, //触摸移动距离x
    moveY: 0, //触摸移动距离y
    fodderX: 5, //素材初始x
    fodderY: 20, //素材初始y,
    fodderW: 80, //素材初始w
    fodderH: 80, //素材初始h,
    fodderRotate: 0, //素材初始rotate,
    translateX: 0, //素材初始 translateX
    translateY: 0, //素材初始 translateY
    currentCanvas: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
  },
  // 页面初始化
  init(){
    // 默认加载男装款式列表
    this.clothesList(1).then(clothes=>{
      // 默认加载男装第一款的样式
      this.getStyle(clothes[0].id).then()
    })
  },
  // 切换服装类型
  tabType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      currentDirection: 'front_thumb'
    })
    this.clothesList(e.currentTarget.dataset.type).then(clothes=>{
      // 加载第一款的样式
      if(clothes.length>0){
        this.getStyle(clothes[0].id).then()
      }
    })
  },
  // 获取衣服款式列表
  clothesList(type) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://cy.nulizhe.com/api/Clothes/clothesList',
        data: {
          type: type
        },
        success: res => {
          if (res.data.code == 1) {
            resolve(res.data.data.clothes)
            this.setData({
              clothes: res.data.data.clothes
            })
          } else {
            wx.showToast({
              title: res.data.message,
              image: '/images/tip.png'
            })
          }
        }
      })
    })
  },
  // 获取衣服颜色和素材
  getStyle(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://cy.nulizhe.com/api/Clothes/clothesStyle',
        data: {
          clothes_id: id
        },
        success: res => {
          if (res.data.code == 1) {
            resolve(res.data.data.colors)
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
      fodderStep: 1
    })
    // 记载素材分类
    this.getFodderTypes()
    // 默认加载全部素材第一页
    this.getFodders()
  },
  // 点击返回按钮
  backSelectFodder() {
    this.setData({
      fodderStep: 0,
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
    if (this.data.currentFodderPage < this.data.maxPage) {
      this.setData({
        currentFodderPage: this.data.currentFodderPage + 1
      })
    } else {
      this.setData({
        currentFodderPage: 1
      })
    }
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
        success: res => {
          wx.hideLoading()
          if (res.data.code == 1) {
            this.data.fodders.push(res.data.data.materials)
            this.setData({
              pageNo: this.data.pageNo + 1,
              fodders: this.data.fodders,
              maxPage: res.data.data.total
            })
          } else {
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
  nextPage() {
    this.getFodders()
  },
  // 渲染画布
  draw() {
    const canvas = wx.createCanvasContext('canvas01')
    //清空画布
    canvas.clearRect(-(item.x + item.w / 2), -(item.y + item.h / 2), 1000, 1200)
    this.data.fodderObject.forEach(item => {
      canvas.translate(item.x + item.w / 2, item.y + item.h / 2)
      canvas.rotate(item.rotate * Math.PI / 180)
      canvas.drawImage(item.file, item.w / 2, item.h / 2, item.w, item.h)
      canvas.rotate(-item.rotate * Math.PI / 180)
      canvas.translate(-(item.x + item.w / 2), -(item.y + item.h / 2))
      canvas.draw(true, () => {
        this.setData({
          notNull: true, //画布不为空
        })
      })
    })
  },
  // 选择素材
  pickerFodder(e) {
    wx.showLoading({
      title: '请稍等',
    })
    wx.downloadFile({
      url: this.data.fodders[this.data.currentFodderPage - 1][e.currentTarget.dataset.index].thumb,
      success: res => {
        wx.hideLoading()
        this.setData({
          fodderStep: 2,
          fodderObject: [{
            file: res.tempFilePath,
            x: 5,
            y: 20,
            w: 80,
            h: 80,
            rotate: 0
          }]
        })
        this.draw()
      }
    })
  },
  // 触摸开始
  touchstart(e) {
    this.setData({
      startX: e.touches[0].x,
      startY: e.touches[0].y,
      fodderX: this.data.fodderObject[0].x,
      fodderY: this.data.fodderObject[0].y
    })
  },
  // 触摸移动
  touchmove(e) {
    this.setData({
      moveX: e.touches[0].x - this.data.startX,
      moveY: e.touches[0].y - this.data.startY,
    })
    this.data.fodderObject[0].x = this.data.fodderX + this.data.moveX
    this.data.fodderObject[0].y = this.data.fodderY + this.data.moveY
    this.setData({
      fodderObject: this.data.fodderObject
    })
    // 重新渲染画布
    this.draw()
  },
  // 触摸结束
  touchend(e) {
    this.setData({
      fodderX: this.data.fodderObject[0].x,
      fodderY: this.data.fodderObject[0].y
    })
  },
  // 素材缩放
  fodderSize(event) {
    this.data.fodderObject[this.data.currentCanvas].w = this.data.fodderW * (event.detail.value / 50)
    this.data.fodderObject[this.data.currentCanvas].h = this.data.fodderH * (event.detail.value / 50)
    // 重新渲染画布
    this.draw()
  },
  // 素材旋转
  fodderRotate(event) {
    this.data.fodderObject[this.data.currentCanvas].rotate = event.detail.value
    this.setData({
      translateX: this.data.fodderX + this.data.fodderW / 2,
      translateY: this.data.fodderY + this.data.fodderH / 2
    })
    // 重新渲染画布
    this.draw()
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