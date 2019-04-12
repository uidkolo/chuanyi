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
    designFodders: { //画布上的素材
      front_thumb: [],
      back_thumb: []
    },
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
    disabled: true,
    designProgress: 0, //设计进度
    uploadMask: false,
    currentFodderIndex: 0, //当前操作的素材
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
  },

  // 页面初始化
  init() {
    this.getSystemInfo()
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
  // 获取屏幕比例
  getSystemInfo() {
    wx.getSystemInfo({
      success: info => {
        this.setData({
          ratio: info.windowWidth / 375
        })
      }
    })
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
      fodderStep: 0
    })
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
    wx.showLoading({
      title: '请稍等',
    })

    if (e.currentTarget.dataset.type == 0) { //默认素材
      var thumb = this.data.defaultFooders[e.currentTarget.dataset.index].thumb
      var url = this.data.defaultFooders[e.currentTarget.dataset.index].img_url
    } else { //素材列表
      var thumb = this.data.fodders[this.data.currentFodderPage - 1][e.currentTarget.dataset.index].thumb
      var url = this.data.fodders[this.data.currentFodderPage - 1][e.currentTarget.dataset.index].img_url
    }

    wx.getImageInfo({
      src: thumb,
      success: info => {
        let ratio = this.data.ratio
        let fodder = {
          type: 'img',
          url: url,
          thumb: info.path,
          x: 30 * ratio,
          y: (180 - 75 * (info.height / info.width)) / 2 * ratio,
          w: 75 * ratio,
          h: 75 * (info.height / info.width) * ratio,
          scale: 1,
          rotate: 0
        }

        if (!this.data.changeFodder && this.data.designFodders[this.data.currentDirection].length < 2) {
          this.data.designFodders[this.data.currentDirection].push(fodder)
          this.data.currentFodderIndex = this.data.designFodders[this.data.currentDirection].length - 1
        } else {
          this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
        }
        this.setData({
          changeFodder: false,
          currentFodderIndex: this.data.currentFodderIndex,
          fodderStep: 2,
          designFodders: this.data.designFodders
        })
        wx.hideLoading()
      }
    })
  },
  // 操作素材
  editFodder(e) {
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    if (type == 'font') {
      this.setData({
        fodderStep: 4,
        currentFodderIndex: index
      })
    } else {
      this.setData({
        fodderStep: 2,
        currentFodderIndex: index
      })
    }
  },
  // 移动素材
  movFodder(e) {
    let index = e.currentTarget.dataset.index
    this.data.designFodders[this.data.currentDirection][index].x = e.detail.x
    this.data.designFodders[this.data.currentDirection][index].y = e.detail.y
    this.setData({
      currentFodderIndex: index
    })
  },
  // 素材缩放
  fodderSize(e) {
    let ratio = this.data.ratio
    let fodder = this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex]
    let whRatio = fodder.h / fodder.w
    let scale = e.detail.value / 50
    fodder.scale = scale
    fodder.w = 75 * ratio * scale
    fodder.h = 75 * whRatio * ratio * scale
    this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
    this.setData({
      designFodders: this.data.designFodders
    })
  },
  // 素材旋转
  fodderRotate(e) {
    let fodder = this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex]
    fodder.rotate = e.detail.value

    this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
    this.setData({
      designFodders: this.data.designFodders
    })
  },
  // 换一个
  changOne() {
    this.setData({
      changeFodder: true
    })
    this.showSelectFodder()
  },
  // 居中
  alignCenter() {
    let fodder = this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex]
    let ratio = this.data.ratio
    fodder.x = 135 * ratio / 2 - fodder.w / 2
    this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
    this.setData({
      designFodders: this.data.designFodders
    })
  },
  // 清除
  clear() {
    let index = this.data.currentFodderIndex
    let fodders = this.data.designFodders[this.data.currentDirection]
    fodders.splice(index, 1)
    if (fodders.length == 0) {
      this.setData({
        fodderStep: 0
      })
    } else {
      this.setData({
        currentFodderIndex: 0
      })
    }
    this.setData({
      designFodders: this.data.designFodders
    })
  },
  // 完成
  confirm() {
    this.setData({
      fodderStep: 0,
      designFodders: this.data.designFodders
    })
  },

  // 选择相册图片
  choicePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: file => {
        if (file.tempFiles[0].size < 2 * 1024 * 1024) {
          wx.showModal({
            content: '像素不够，印刷不清晰',
            showCancel: false,
            confirmText: '我知道了'
          })
        }

        wx.getImageInfo({
          src: file.tempFilePaths[0],
          success: info => {
            let ratio = this.data.ratio
            let fodder = {
              type: 'photo',
              url: info.path,
              thumb: info.path,
              x: 30 * ratio,
              y: (180 - 75 * (info.height / info.width)) / 2 * ratio,
              w: 75 * ratio,
              h: 75 * (info.height / info.width) * ratio,
              scale: 1,
              rotate: 0
            }

            if (!this.data.changeFodder && this.data.designFodders[this.data.currentDirection].length < 2) {
              this.data.designFodders[this.data.currentDirection].push(fodder)
              this.data.currentFodderIndex = this.data.designFodders[this.data.currentDirection].length - 1
            } else {
              this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
            }
            this.setData({
              changeFodder: false,
              currentFodderIndex: this.data.currentFodderIndex,
              fodderStep: 2,
              designFodders: this.data.designFodders
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 新增字体
  addFont() {
    this.setData({
      fodderStep: 4
    })
    // 加载字体列表
    this.getFonts().then(fonts => {
      // 加载颜色库
      this.getFontColors().then(colors => {
        this.addDefinedFontImage()
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
                fonts: res.data.data.fonts,
                font_id: res.data.data.fonts[0].id
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
                fontColors: res.data.data.colors,
                color: res.data.data.colors[0].color
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
      fontIndex: e.currentTarget.dataset.index,
      word: this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex].content
    })
    this.changeFontImage()
  },
  // 选择颜色
  pickerFontColor(e) {
    this.setData({
      color: e.currentTarget.dataset.color,
      word: this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex].content
    })
    this.changeFontImage()
  },
  // 修改文字方向
  changeDir() {
    this.setData({
      direction: this.data.direction == 1 ? 2 : 1,
      word: this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex].content
    })
    // 重新生成字体
    this.changeFontImage()
  },
  // 获取字体图片
  getFontImage() {
    if (this.data.word == '') {
      wx.showModal({
        content: '请输入文字！',
      })
    } else {
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
            let url = res.data.data.font_img
            wx.getImageInfo({
              src: url,
              success: info => {
                let ratio = this.data.ratio
                let fodder = {
                  type: 'font',
                  content: this.data.word,
                  url: info.path,
                  thumb: info.path,
                  x: 30 * ratio,
                  y: (180 - 75 * (info.height / info.width)) / 2 * ratio,
                  w: 75 * ratio,
                  h: 75 * (info.height / info.width) * ratio,
                  scale: 1,
                  rotate: 0
                }

                if (!this.data.changeFodder && this.data.designFodders[this.data.currentDirection].length < 2) {
                  this.data.designFodders[this.data.currentDirection].push(fodder)
                  this.data.currentFodderIndex = this.data.designFodders[this.data.currentDirection].length - 1
                } else {
                  this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
                }
                this.setData({
                  word: '',
                  changeFodder: false,
                  currentFodderIndex: this.data.currentFodderIndex,
                  fodderStep: 4,
                  designFodders: this.data.designFodders
                })
                wx.hideLoading()
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
    }
  },
  // 添加默认字体素材
  addDefinedFontImage() {
    wx.request({
      url: 'https://cy.nulizhe.com/api/font_image/make',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      data: {
        token: wx.getStorageSync('auth_token'),
        word: '串衣',
        font_id: this.data.font_id,
        color: this.data.color,
        direction: this.data.direction
      },
      success: res => {
        if (res.data.code == 1) {
          let url = res.data.data.font_img
          wx.getImageInfo({
            src: url,
            success: info => {
              let ratio = this.data.ratio
              let fodder = {
                type: 'font',
                content: '串衣',
                url: info.path,
                thumb: info.path,
                x: 30 * ratio,
                y: (180 - 75 * (info.height / info.width)) / 2 * ratio,
                w: 75 * ratio,
                h: 75 * (info.height / info.width) * ratio,
                scale: 1,
                rotate: 0
              }

              if (!this.data.changeFodder && this.data.designFodders[this.data.currentDirection].length < 2) {
                this.data.designFodders[this.data.currentDirection].push(fodder)
                this.data.currentFodderIndex = this.data.designFodders[this.data.currentDirection].length - 1
              } else {
                this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder
              }
              this.setData({
                word: '',
                changeFodder: false,
                currentFodderIndex: this.data.currentFodderIndex,
                designFodders: this.data.designFodders
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
  // 修改字体
  changeFontImage() {
    if (this.data.word == '') {
      wx.showModal({
        content: '请输入文字！',
      })
    } else {
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
            let url = res.data.data.font_img
            wx.getImageInfo({
              src: url,
              success: info => {
                let ratio = this.data.ratio
                let fodder = {
                  type: 'font',
                  content: this.data.word,
                  url: info.path,
                  thumb: info.path,
                  x: 30 * ratio,
                  y: (180 - 75 * (info.height / info.width)) / 2 * ratio,
                  w: 75 * ratio,
                  h: 75 * (info.height / info.width) * ratio,
                  scale: 1,
                  rotate: 0
                }
                this.data.designFodders[this.data.currentDirection][this.data.currentFodderIndex] = fodder

                this.setData({
                  word: '',
                  changeFodder: false,
                  currentFodderIndex: this.data.currentFodderIndex,
                  fodderStep: 4,
                  designFodders: this.data.designFodders
                })
                wx.hideLoading()
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
    }
  },
  // 阻值冒泡
  stopBub() {
    return false
  },
  // 完成设计
  confirmDesign() {
    var _that = this
    let fodders = this.data.designFodders
    if (fodders['front_thumb'].length == 0 && fodders['back_thumb'].length == 0) {
      wx.showModal({
        content: '请添加素材',
      })
    } else {
      // 下载素材大图
      var fodderArr = []
      for (let key in fodders) {
        fodders[key].forEach((item, index) => {
          if (item.type == 'img') {
            item.dir = key
            item.index = index
            fodderArr.push(item)
          }
        })
      }

      this.setData({
        uploadMask: true,
        uploadIndex: 0
      })
      if (fodderArr.length > 0) {
        download(this.data.uploadIndex)
      } else {
        this.createDesign()
      }

      function download(index) {
        console.log('下载大图素材')
        var downloadTask = wx.downloadFile({
          url: fodderArr[index].url,
          success: file => {
            let dir = fodderArr[index].dir
            let ind = fodderArr[index].index
            _that.data.designFodders[dir][ind].url = file.tempFilePath

            if (index < fodderArr.length - 1) {
              _that.setData({
                uploadIndex: _that.data.uploadIndex + 1
              })
              download(_that.data.uploadIndex)
            } else { //所有素材下载完=>生成设计图
              console.log('素材下载完成')
              _that.createDesign()
            }
          }
        })
        // 监听下载进度
        var progress = _that.data.designProgress
        downloadTask.onProgressUpdate((res) => {
          _that.setData({
            designProgress: progress + Math.round(15 * (res.progress) / 100)
          })
        })
      }
    }
  },
  // 合成设计图
  createDesign() {
    console.log('开始生成设计')
    var _that = this
    let fodders = this.data.designFodders
    let front = fodders['front_thumb']
    let back = fodders['back_thumb']
    let fodderArr = []
    for (let key in fodders) {
      fodders[key].forEach((item, index) => {
        item.dir = key
        item.index = index
        fodderArr.push(item)
      })
    }

    // 生成缩略图
    function toViewImg(bg, arr) {
      return new Promise((resolve, reject) => {
        console.log('开始生成缩略图')
        let width = 310
        let height = 400
        _that.setData({
          designCanvasW: width,
          designCanvasH: height
        })
        var context = wx.createCanvasContext('canvas-design')
        // 生成背景
        setTimeout(() => {
          console.log('生成中...')
          var downloadTask = wx.downloadFile({
            url: bg,
            success: file => {
              context.drawImage(file.tempFilePath, 0, 0, width, height) //绘制背景
              context.save()
              context.moveTo(155 - 135 / 2, 110)
              context.lineTo(155 + 135 / 2, 110)
              context.lineTo(155 + 135 / 2, 290)
              context.lineTo(155 - 135 / 2, 290)
              context.lineTo(155 - 135 / 2, 110)
              context.clip()
              context.translate(155, 200)
              arr.forEach(item => {
                context.rotate(item.rotate * Math.PI / 180)
                context.drawImage(item.thumb, 175 / 2 + item.x - 155, 110 + item.y - 200, item.w, item.h)
              })

              context.draw(false, () => {
                wx.canvasToTempFilePath({
                  canvasId: 'canvas-design',
                  success: res => {
                    // 上传图片
                    console.log(res.tempFilePath)
                    console.log('开始上传')
                    _that.uploadImg(res.tempFilePath, 8).then(url => {
                      console.log('上传完成')
                      resolve(url)
                    })
                  }
                })
              })
            }
          })
          // 监听下载进度
          var progress = _that.data.designProgress
          downloadTask.onProgressUpdate((res) => {
            _that.setData({
              designProgress: progress + Math.round(2 * (res.progress) / 100)
            })
          })
        }, 200)
      })
    }

    // 生成设计稿
    function toDesignImg(arr, progress) {
      return new Promise((resolve, reject) => {
        console.log('开始生成设计搞')
        let width = 30000 / 13.5
        let height = 40000 / 13.5
        let ratio = width / 135
        _that.setData({
          designCanvasW: width,
          designCanvasH: height
        })

        var context = wx.createCanvasContext('canvas-design')

        setTimeout(() => {
          console.log('生成中...')
          context.translate(width / 2, height / 2)
          arr.forEach(item => {
            context.rotate(item.rotate * Math.PI / 180)
            context.drawImage(item.url, item.x * ratio - width / 2, item.y * ratio - height / 2, item.w * ratio, item.h * ratio)
          })
          context.draw(false, () => {
            wx.canvasToTempFilePath({
              canvasId: 'canvas-design',
              destWidth: width,
              destHeight: height,
              success: res => {
                // 上传图片
                console.log(res.tempFilePath)
                console.log('开始上传')
                _that.uploadImg(res.tempFilePath, progress).then(url => {
                  console.log('上传完成')
                  resolve(url)
                })
              }
            })
          })
        }, 200)

      })
    }

    let fontBg = _that.data.colors[_that.data.currentColorIndex]['front_thumb']
    let backBg = _that.data.colors[_that.data.currentColorIndex]['back_thumb']
    toViewImg(fontBg, front).then(frontThumb => {
      toViewImg(backBg, back).then(backThumb => {
        let progress = (99 - _that.data.designProgress) / 2
        toDesignImg(front, progress).then(frontUrl => {
          toDesignImg(back, progress).then(backUrl => {
            console.log('frontThumb', frontThumb)
            console.log('backThumb', backThumb)
            console.log('frontUrl', frontUrl)
            console.log('backUrl', backUrl)

            let design = {
              frontThumb: frontThumb,
              backThumb: backThumb,
              frontUrl: frontUrl,
              backUrl: backUrl
            }

            this.setData({
              uploadMask: false,
              designCanvasW: 0,
              designCanvasH: 0,
              designProgress: 0
            })

            _that.saveDesign(design).then(id => {
              wx.redirectTo({
                url: `/pages/index/detail/detail?id=${id}`,
              })
            })

          })
        })
      })
    })
  },
  //上传图片
  uploadImg(file, progress) {
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
      // 监听上传进度
      let designProgress = this.data.designProgress
      uploadTask.onProgressUpdate((res) => {
        this.setData({
          designProgress: designProgress + Math.round(progress * (res.progress) / 100)
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
  saveDesign(design) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://cy.nulizhe.com/api/Design/saveDesign',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: {
          token: wx.getStorageSync('auth_token'),
          front: design.frontUrl,
          front_thumb: design.frontThumb,
          back: design.backUrl,
          back_thumb: design.backThumb,
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
    return {
      title: wx.getStorageSync('shareInfo').word,
      path: '/pages/index/index?shop=' + wx.getStorageSync('shop'),
      imageUrl: wx.getStorageSync('shareInfo').cover
    }
  }
})