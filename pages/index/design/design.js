// pages/index/design/design.js
const uploadImage = require('../../../utils/uploadFile.js')
const util = require('../../../utils/util.js')
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
    defaultW: 0, //素材宽度
    defaultH: 0, //素材高度
    designCanvasW: 0, //最终设计canvas宽度
    designCanvasH: 0, //最终设计canvas高度
    viewCanvasW: 0, //最终预览图canvas宽度
    viewCanvasH: 0, //最终预览图canvas高度
    fontMask: false,
    fontColorMask: false,
    fontIndex: 0,
    fontId: '',
    direction: 1,
    word: '',
    sliderValue: {
      front_thumb: {
        sizeValue: 50,
        rotateValue: 0
      },
      back_thumb: {
        sizeValue: 50,
        rotateValue: 0
      }
    },
    sizeValue: 50, //大小slider的值
    rotateValue: 0, //角度slider的值
    disabled: true,
    designProgress: 0 ,//设计进度
    uploadMask: false
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
      this.setData({
        clothes_id: clothes[0].id
      })
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
    this.setData({
      clothes_id: e.currentTarget.dataset.id
    })
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
      sizeValue: this.data.sliderValue[e.currentTarget.dataset.label].sizeValue,
      rotateValue: this.data.sliderValue[e.currentTarget.dataset.label].rotateValue
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
      var thumb = this.data.defaultFooders[e.currentTarget.dataset.index].thumb
      var url = this.data.defaultFooders[e.currentTarget.dataset.index].img_url
    } else { //素材列表
      var thumb = this.data.fodders[this.data.currentFodderPage - 1][e.currentTarget.dataset.index].thumb
      var url = this.data.fodders[this.data.currentFodderPage - 1][e.currentTarget.dataset.index].img_url
    }
    wx.showLoading({
      title: '请稍等',
    })
    wx.downloadFile({ //下载图片
      url: thumb,
      success: file => {
        wx.hideLoading()
        wx.getImageInfo({
          src: file.tempFilePath,
          success: info => {
            this.setData({
              defaultW: 80,
              defaultH: 80 * (info.height / info.width)
            })
            wx.getSystemInfo({ //获取屏幕宽度
              success: res => {
                let ratio = res.windowWidth / 375 //比例
                this.data.designFodders[this.data.currentDirection] = {
                  type: 'img',
                  url: url,
                  thumb: file.tempFilePath,
                  x: 5 * ratio,
                  y: (120 - 80 * (info.height / info.width)) / 2 * ratio,
                  w: 80 * ratio,
                  h: 80 * (info.height / info.width) * ratio,
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
          canvas.drawImage(fodder.thumb, -fodder.w / 2, -fodder.h / 2, fodder.w, fodder.h)
        }
        canvas.draw()
      }
    })

  },
  // 触摸开始
  touchstart(e) {
    this.setData({
      startX: e.touches[0].x,
      startY: e.touches[0].y,
      sizeValue: this.data.sliderValue[this.data.currentDirection].sizeValue,
      rotateValue: this.data.sliderValue[this.data.currentDirection].rotateValue
    })
    if (this.data.designFodders[this.data.currentDirection].x != undefined) {
      this.setData({
        fodderX: this.data.designFodders[this.data.currentDirection].x,
        fodderY: this.data.designFodders[this.data.currentDirection].y,
        fodderStep: this.data.designFodders[this.data.currentDirection].type == 'font' ? 3 : 2
      })
    }
  },
  // 触摸移动
  touchmove(e) {
    if (this.data.designFodders[this.data.currentDirection].x != undefined && this.data.fodderStep != 0) {
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
    this.data.sliderValue[this.data.currentDirection].sizeValue = event.detail.value
    this.setData({
      sliderValue: this.data.sliderValue
    })
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
    this.data.sliderValue[this.data.currentDirection].rotateValue = event.detail.value
    this.setData({
      sliderValue: this.data.sliderValue
    })
    this.data.designFodders[this.data.currentDirection].rotate = event.detail.value
    this.setData({
      designFodders: this.data.designFodders
    })
    // 重新渲染画布
    this.draw()
  },
  // 换一个
  changOne() {
    this.showSelectFodder()
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
  // 完成
  confirm() {
    this.setData({
      fodderStep: 0
    })
  },
  // 修改文字方向
  changeDir() {
    this.setData({
      direction: this.data.direction == 1 ? 2 : 1
    })
    // 重新生成字体
    this.getFontImage()
  },

  // 选择相册图片
  choicePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: file => {
        console.log(file)
        wx.getImageInfo({
          src: file.tempFilePaths[0],
          success: info => {
            this.setData({
              defaultW: 80,
              defaultH: 80 * (info.height / info.width)
            })
            wx.getSystemInfo({ //获取屏幕宽度
              success: res => {
                let ratio = res.windowWidth / 375 //比例
                this.data.designFodders[this.data.currentDirection] = {
                  type: 'photo',
                  url: file.tempFilePaths[0],
                  thumb: file.tempFilePaths[0],
                  x: 5 * ratio,
                  y: (120 - 80 * (info.height / info.width)) / 2 * ratio,
                  w: 80 * ratio,
                  h: 80 * (info.height / info.width) * ratio,
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
  // 新增字体
  addFont() {
    if (this.data.designFodders[this.data.currentDirection].type != 'font') {
      this.setData({
        fodderStep: 3,
        sizeValue: 50,
        rotateValue: 0
      })
    } else {
      this.setData({
        fodderStep: 3,
        sizeValue: this.data.sliderValue[this.data.currentDirection].sizeValue,
        rotateValue: this.data.sliderValue[this.data.currentDirection].rotateValue
      })
    }

    // 加载字体列表
    this.getFonts().then(fonts => {
      this.setData({
        font_id: fonts[0].id
      })
    })
    // 加载颜色库
    this.getFontColors().then(colors => {
      this.setData({
        color: colors[0].color
      })
    })
  },
  // 加载字体列表
  getFonts() {
    return new Promise((resolve, reject) => {
      if (!this.data.fonts) {
        wx.request({
          url: 'https://cy.nulizhe.com/api/material/fonts',
          success: res => {
            if (res.data.code == 1) {
              this.setData({
                fonts: res.data.data.fonts
              })
              resolve(res.data.data.fonts)
            } else {
              wx.showToast({
                title: res.data.message,
                images: '/images/tip.png'
              })
            }
          }
        })
      } else {
        resolve(this.data.fonts)
      }
    })
  },
  // 加载颜色库
  getFontColors() {
    return new Promise((resolve, reject) => {
      if (!this.data.fontColors) {
        wx.request({
          url: 'https://cy.nulizhe.com/api/material/getColors',
          success: res => {
            if (res.data.code == 1) {
              this.setData({
                fontColors: res.data.data.colors
              })
              resolve(res.data.data.colors)
            } else {
              wx.showToast({
                title: res.data.message,
                images: '/images/tip.png'
              })
            }
          }
        })
      } else {
        resolve(this.data.fontColors)
      }
    })
  },
  // input
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  // 修改字体
  changeFont() {
    this.setData({
      fontMask: true
    })
  },
  // 修改颜色
  changeFontColor() {
    this.setData({
      fontColorMask: true
    })
  },
  // 选择字体
  pickerFont(e) {
    this.setData({
      font_id: e.currentTarget.dataset.id,
      fontIndex: e.currentTarget.dataset.index
    })
    this.getFontImage()
  },
  // 选择颜色
  pickerFontColor(e) {
    this.setData({
      color: e.currentTarget.dataset.color,
    })
    this.getFontImage()
  },
  // 获取字体图片
  getFontImage() {
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: 'https://cy.nulizhe.com/api/font_image/make',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      data: {
        token: wx.getStorageSync('auth_token'),
        word: this.data.word,
        font_id: this.data.font_id,
        color: this.data.color,
        direction: this.data.direction
      },
      success: res => {
        if (res.data.code == 1) {
          wx.downloadFile({ //下载图片
            url: res.data.data.font_img + '?x-oss-process=style/mini',
            success: file => {
              this.data.sliderValue[this.data.currentDirection].sizeValue = 50
              this.data.sliderValue[this.data.currentDirection].rotateValue = 0
              this.setData({
                disabled: false,
                sliderValue: this.data.sliderValue
              })
              wx.hideLoading()
              wx.getImageInfo({
                src: file.tempFilePath,
                success: info => {
                  // 根据字体方向设置大小
                  if (this.data.direction == 1) {
                    this.setData({
                      defaultW: 80,
                      defaultH: 80 * (info.height / info.width)
                    })
                    var w = 80
                    var h = 80 * (info.height / info.width)
                    var x = (90 - w) / 2
                    var y = (120 - h) / 2
                  } else {
                    this.setData({
                      defaultW: 100 * (info.width / info.height),
                      defaultH: 100
                    })
                    var w = 80 * (info.width / info.height)
                    var h = 80
                    var x = (90 - w) / 2
                    var y = (120 - h) / 2
                  }

                  wx.getSystemInfo({ //获取屏幕宽度
                    success: sysInfo => {
                      let ratio = sysInfo.windowWidth / 375 //比例
                      this.data.designFodders[this.data.currentDirection] = {
                        type: 'font',
                        url: res.data.data.font_img,
                        thumb: file.tempFilePath,
                        x: x * ratio,
                        y: y * ratio,
                        w: w * ratio,
                        h: h * ratio,
                        rotate: 0
                      }
                      this.setData({
                        fodderStep: 3,
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
        } else {
          wx.showToast({
            title: res.data.message,
            images: '/images/tip.png'
          })
        }
      }
    })
  },
  // 完成设计
  confirmDesign() {
    this.setData({
      uploadMask: true
    })
    const fodderFront = this.data.designFodders.front_thumb
    const fodderBack = this.data.designFodders.back_thumb
    this.createDesign(fodderFront,25,10).then(frontDesignUrl => {
      this.createDesign(fodderBack, 25,10).then(backDesignUrl => {
        this.setData({
          designCanvasW: 0,
          designCanvasH: 0,
          frontDesignUrl: frontDesignUrl,
          backDesignUrl: backDesignUrl
        })
        // 生成预览图
        const frontBg = this.data.colors[this.data.currentColorIndex].front_thumb
        const frontFodder = this.data.designFodders['front_thumb']
        const backBg = this.data.colors[this.data.currentColorIndex].back_thumb
        const backFodder = this.data.designFodders['back_thumb']
        this.createViewImg(frontBg, frontFodder, 10,5).then(frontView => {
          this.createViewImg(backBg, backFodder, 10,5).then(backView => {
            this.setData({
              viewCanvasW: 0,
              viewCanvasH: 0,
              frontViewUrl: frontView,
              backViewUrl: backView
            })
            wx.hideLoading()
            // 保存设计
            this.saveDesign().then(id => {
              wx.navigateTo({
                url: `/pages/index/detail/detail?id=${id}`,
              })
              this.setData({
                uploadMask: false,
                designProgress: 0
              })
            })
          })
        })
      })
    })
  },
  // 生成设计图
  createDesign(fooder, progressD, progressU ) {
    return new Promise((resolve, reject) => {
      var designCanvas = wx.createCanvasContext('canvas-design')
      if (fooder.type == 'img' || fooder.type == 'font') { //素材
        var downloadTask = wx.downloadFile({
          url: fooder.url,
          success: file => {
            let width = 30000 / 9
            let height = 40000 / 9
            let fodderW = width * (fooder.w / 90)
            let fodderH = height * (fooder.h / 120)
            let fodderX = width * (fooder.x / 90)
            let fodderY = height * (fooder.y / 120)
            this.setData({
              designCanvasW: width,
              designCanvasH: height
            })
            designCanvas.clearRect(0, 0, width, height) //清空画布
            designCanvas.translate(fodderX + fodderW / 2, fodderY + fodderH / 2)
            designCanvas.rotate(fooder.rotate * Math.PI / 180)
            designCanvas.drawImage(file.tempFilePath, -fodderW / 2, -fodderH / 2, fodderW, fodderH)
            designCanvas.draw(false, () => {
              wx.canvasToTempFilePath({
                destWidth: width,
                destHeight: height,
                canvasId: 'canvas-design',
                quality: 1,
                success: res => {
                  // 上传图片
                  this.uploadImg(res.tempFilePath, progressU).then(url => {
                    resolve(url)
                  })
                }
              })
            })
          }
        })
        // 监听下载进度
        let designProgress = this.data.designProgress
        downloadTask.onProgressUpdate((res) => {
          this.setData({
            designProgress: designProgress + Math.ceil(progressD*(res.progress)/100)
          })
        })
      } else if (fooder.type == "photo") { //相册
        // let width = 30000 / 9
        // let height = 40000 / 9
        let width = 3000 / 9
        let height = 4000 / 9
        let fodderW = width * (fooder.w / 90)
        let fodderH = height * (fooder.h / 120)
        let fodderX = width * (fooder.x / 90)
        let fodderY = height * (fooder.y / 120)
        this.setData({
          designCanvasW: width,
          designCanvasH: height
        })
        designCanvas.clearRect(0, 0, width, height) //清空画布
        designCanvas.translate(fodderX + fodderW / 2, fodderY + fodderH / 2)
        designCanvas.rotate(fooder.rotate * Math.PI / 180)
        designCanvas.drawImage(fooder.url, -fodderW / 2, -fodderH / 2, fodderW, fodderH)
        designCanvas.draw(false, () => {
          wx.canvasToTempFilePath({
            destWidth: width,
            destHeight: height,
            canvasId: 'canvas-design',
            quality: 1,
            success: res => {
              // 上传图片
              this.uploadImg(res.tempFilePath).then(url => {
                resolve(url)
              })
            }
          })
        })
      } else { //素材为空
        let width = 30000 / 9
        let height = 40000 / 9
        this.setData({
          designCanvasW: width,
          designCanvasH: height
        })
        designCanvas.clearRect(0, 0, width, height) //清空画布
        designCanvas.draw(false, () => {
          wx.canvasToTempFilePath({
            destWidth: width,
            destHeight: height,
            canvasId: 'canvas-design',
            quality: 1,
            success: res => {
              // 上传图片
              this.uploadImg(res.tempFilePath).then(url => {
                resolve(url)
              })
            }
          })
        })
      }
    })
  },
  // 生成预览图
  createViewImg(bg, fooder, progressD, progressU) {
    return new Promise((resolve, reject) => {
      var viewCanvas = wx.createCanvasContext('canvas-view')
      var canvasW = 412
      var canvasH = 530
      this.setData({
        viewCanvasW: canvasW,
        viewCanvasH: canvasH,
      })
      viewCanvas.clearRect(0, 0, canvasW, canvasH) //清空画布
      var downloadTask = wx.downloadFile({
        url: bg,
        success: fileBg => {
          viewCanvas.drawImage(fileBg.tempFilePath, 0, 0, canvasW, canvasH) //绘制背景
          viewCanvas.drawImage(fooder.thumb, 116 + fooder.x * 2, 145 + fooder.y * 2, fooder.w * 2, fooder.h * 2) //绘制素材
          viewCanvas.draw(false, () => {
            wx.canvasToTempFilePath({
              destWidth: canvasW,
              destHeight: canvasH,
              canvasId: 'canvas-view',
              quality: 1,
              success: res => {
                // 上传图片
                this.uploadImg(res.tempFilePath, progressU).then(url => {
                  resolve(url)
                })
              }
            })
          })
        }
      })
      // 监听下载进度
      let designProgress = this.data.designProgress
      downloadTask.onProgressUpdate((res) => {
        this.setData({
          designProgress: designProgress + Math.ceil(progressD * (res.progress) / 100)
        })
      })
    })
  },
  //上传图片
  uploadImg: function (file, progressU) {
    return new Promise((resolve, reject) => {
      var nowTime = util.formatTime(new Date());
      var uploadTask = uploadImage(file, 'images/' + nowTime + '/',
        function(result) {
          resolve(result)
        },
        function(result) {
          console.log("======上传失败======", result);
        }
      )
      let designProgress = this.data.designProgress
      // 监听上传进度
      uploadTask.onProgressUpdate((res) => {
        this.setData({
          designProgress: designProgress + Math.ceil(progressU * (res.progress) / 100)
        })
      })
    })
  },
  // 点击mask,关闭mask
  closeMask() {
    this.setData({
      fontMask: false,
      fontColorMask: false
    })
  },
  // 保存设计
  saveDesign() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://cy.nulizhe.com/api/Design/saveDesign',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: {
          token: wx.getStorageSync('auth_token'),
          front: this.data.frontDesignUrl,
          front_thumb: this.data.frontViewUrl,
          back: this.data.backDesignUrl,
          back_thumb: this.data.backViewUrl,
          clothes_id: this.data.clothes_id,
          color: this.data.colors[this.data.currentColorIndex].color,
          color_name: this.data.colors[this.data.currentColorIndex].color_name
        },
        success: res => {
          if (res.data.code == 1) {
            resolve(res.data.data.design_id)
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