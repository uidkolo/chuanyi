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
    defaultFooders: [], //默认素材
    fodderStep: 0, //素材操作阶段
    fodderTypes: [], //素材分类
    fodderTypeName: '全部素材', //素材分类名称
    fodderTypeId: '', //素材类型id
    fodders: [], //素材
    currentFodderPage: 0, //当前素材页码
    pageNo: 1, //当前页码
    pageSize: 10, //每页条数
    maxPage: 1, //最大页数
    designFodders: {
      front_thumb: {},
      back_thumb: {}
    }, //画布上的素材
    startX: 0, //触摸开始点x
    startY: 0, //触摸开始点y
    moveX: 0, //触摸移动距离x
    moveY: 0, //触摸移动距离y
    fodderX: 5, //素材初始x
    fodderY: 20, //素材初始y
    defaultW: 80, //素材默认宽度
    defaultH: 80 //素材默认高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
  },
  // 页面初始化
  init() {
    // 默认加载男装款式列表
    this.clothesList(1).then(clothes => {
      // 默认加载男装第一款的样式
      this.getStyle(clothes[0].id)
    })
    // 默认加载第一页素材
    this.getFodderDefault()
  },
  // 切换服装类型
  tabType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      currentColorIndex: 0,
      currentDirection: 'front_thumb'
    })
    this.clothesList(e.currentTarget.dataset.type).then(clothes => {
      // 加载第一款的样式
      if (clothes.length > 0) {
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
  // 切换款式
  getCothes(e) {
    this.getStyle(e.currentTarget.dataset.id)
  },
  // 切换颜色
  tabColor(e) {
    this.setData({
      currentDirection: 'front_thumb',
      currentColorIndex: e.currentTarget.dataset.index
    })
  },
  //切换正反面
  tabDirection(e) {
    this.setData({
      currentDirection: e.currentTarget.dataset.label,
      fodderStep: 0,
      // designFodders:{
      //   front_thumb: {},
      //   back_thumb: {}
      // }
    })
    this.draw()
  },
  // 点击素材按钮
  showSelectFodder() {
    this.setData({
      fodderStep: 1
    })
    // 加载素材分类
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
  // 加载默认素材
  getFodderDefault() {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: 'https://cy.nulizhe.com/api/Material/getMaterialByType',
      data: {
        page: 1,
        limit: 10
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 1) {
          this.setData({
            defaultFooders: res.data.data.materials
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
  //下一页
  nextPage() {
    this.getFodders()
  },
  // 选择素材
  pickerFodder(e) {
    if (e.currentTarget.dataset.type == 0) { //默认素材
      var url = this.data.defaultFooders[e.currentTarget.dataset.index].thumb
    } else { //素材列表
      var url = this.data.fodders[this.data.currentFodderPage - 1][e.currentTarget.dataset.index].thumb
    }
    wx.showLoading({
      title: '请稍等',
    })
    wx.downloadFile({ //下载图片
      url: url,
      success: file => {
        wx.hideLoading()
        wx.getSystemInfo({ //获取屏幕宽度
          success: res => {
            let ratio = res.windowWidth / 375 //比例
            this.data.designFodders[this.data.currentDirection] = {
              type: 'img',
              file: file.tempFilePath,
              x: 5 * ratio,
              y: 20 * ratio,
              w: this.data.defaultW * ratio,
              h: this.data.defaultW * ratio,
              rotate: 0
            }
            this.setData({
              fodderStep: 2,
              designFodders: this.data.designFodders
            })
            // 渲染画布
            this.draw()
          }
        })
      }
    })
  },
  // 渲染画布
  draw() {
    const canvas = wx.createCanvasContext('canvas')
    var fodder = this.data.designFodders[this.data.currentDirection]
    wx.getSystemInfo({
      success: res => {
        let ratio = res.windowWidth / 375 //比例
        canvas.clearRect(0, 0, 90 * ratio, 120 * ratio) //清空画布
        if (this.data.designFodders[this.data.currentDirection].x != undefined) {
          canvas.translate(fodder.x + fodder.w / 2, fodder.y + fodder.h / 2)
          canvas.rotate(fodder.rotate * Math.PI / 180)
          canvas.drawImage(fodder.file, -fodder.w / 2, -fodder.h / 2, fodder.w, fodder.h)
        }
        canvas.draw()
      }
    })

  },
  // 触摸开始
  touchstart(e) {
    this.setData({
      startX: e.touches[0].x,
      startY: e.touches[0].y
    })
    if (this.data.designFodders[this.data.currentDirection].x != undefined) {
      this.setData({
        fodderX: this.data.designFodders[this.data.currentDirection].x,
        fodderY: this.data.designFodders[this.data.currentDirection].y,
        fodderStep: 2
      })
    }
  },
  // 触摸移动
  touchmove(e) {
    if (this.data.designFodders[this.data.currentDirection].x != undefined && this.data.fodderStep == 2) {
      this.data.designFodders[this.data.currentDirection].x = this.data.fodderX + (e.touches[0].x - this.data.startX)
      this.data.designFodders[this.data.currentDirection].y = this.data.fodderY + (e.touches[0].y - this.data.startY)
      this.setData({
        designFodders: this.data.designFodders
      })
    }
    // 重新渲染画布
    this.draw()
  },
  // 素材缩放
  fodderSize(event) {
    wx.getSystemInfo({
      success: res => {
        let ratio = res.windowWidth / 375 //比例
        this.data.designFodders[this.data.currentDirection].w = this.data.defaultW * ratio * (event.detail.value / 50)
        this.data.designFodders[this.data.currentDirection].h = this.data.defaultH * ratio * (event.detail.value / 50)
        this.setData({
          designFodders: this.data.designFodders
        })
        // 重新渲染画布
        this.draw()
      }
    })
  },
  // 素材旋转
  fodderRotate(event) {
    this.data.designFodders[this.data.currentDirection].rotate = event.detail.value
    this.setData({
      designFodders: this.data.designFodders
    })
    // 重新渲染画布
    this.draw()
  },
  // 换一个
  changOne() {
    this.setData({
      fodderStep: 0
    })
  },
  // 居中
  alignCenter() {
    var fodder = this.data.designFodders[this.data.currentDirection]
    wx.getSystemInfo({
      success: res => {
        let ratio = res.windowWidth / 375 //比例
        fodder.x = 90 * ratio / 2 - fodder.w / 2
        this.setData({
          designFodders: this.data.designFodders
        })
        this.draw()
      }
    })
  },
  // 清除
  clear() {
    this.data.designFodders[this.data.currentDirection] = {}
    this.setData({
      designFodders: this.data.designFodders
    })
    this.draw()
  },

  // 选择相册图片
  choicePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: file => {
        wx.getImageInfo({
          src: file.tempFilePaths[0],
          success: info => {
            this.setData({
              defaultW: 80,
              defaultH: 80*(info.height/info.width)
            })
            wx.getSystemInfo({ //获取屏幕宽度
              success: res => {
                let ratio = res.windowWidth / 375 //比例
                this.data.designFodders[this.data.currentDirection] = {
                  type: 'img',
                  file: file.tempFilePaths[0],
                  x: 5 * ratio,
                  y: 20 * ratio,
                  w: this.data.defaultW * ratio,
                  h: this.data.defaultH * ratio,
                  rotate: 0
                }
                this.setData({
                  fodderStep: 2,
                  designFodders: this.data.designFodders
                })
                // 渲染画布
                this.draw()
              }
            })
          }
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