// pages/mine/wallet/poster/poster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    posterTip: [
      `来自${wx.getStorageSync('userInfo').nick_name}的作品`
    ],
    posterStr: `来自${wx.getStorageSync('userInfo').nick_name}的作品`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getInfo(options.id)
  },
  // 获取作品信息
  getInfo(id) {
    let url = '/api/design/getOneDesign'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      design_id: id
    }).then(data => {
      this.setData({
        info: data
      })
      this.createPoster()
    })
  },
  // 生成海报
  createPoster() {
    wx.showLoading({
      title: '正在生成',
    })
    const canvas = wx.createCanvasContext('poster')
    wx.getSystemInfo({
      success: res => {
        let ratio = res.screenWidth / 375
        //填充背景色
        canvas.rect(0, 0, 345 * ratio, 470 * ratio)
        canvas.setFillStyle('#ffffff')
        canvas.fill()
        // 画线框
        canvas.setLineWidth(0.4)
        canvas.setStrokeStyle('#F7C900')
        canvas.strokeRect(20 * ratio, 35 * ratio, 305 * ratio, 305 * ratio)
        //绘制头图
        wx.downloadFile({
          url: this.data.info.front_thumb,
          success: res => {
            canvas.drawImage(res.tempFilePath, 71.5 * ratio, 57.5 * ratio, 202 * ratio, 260 * ratio)
            canvas.setFontSize(12 * ratio)
            canvas.setFillStyle('#E5BF00')
            canvas.fillText('/  串衣：让服装设计更简单  做自己的服装设计师  /', 35 * ratio, 22 * ratio)
            wx.downloadFile({
              url: wx.getStorageSync('userInfo').avatar,
              success: res => {
                canvas.save()
                canvas.beginPath()
                canvas.arc((20 * ratio) + (30 * ratio) / 2, (360 * ratio) + (30 * ratio) / 2, 15 * ratio, 0, 2 * Math.PI)
                canvas.clip()
                canvas.drawImage(res.tempFilePath, 20 * ratio, 360 * ratio, 30 * ratio, 30 * ratio)
                canvas.restore()
                canvas.setFontSize(14 * ratio)
                canvas.setFillStyle('#333333')
                canvas.fillText(wx.getStorageSync('userInfo').nick_name, 60 * ratio, 380 * ratio)
                
                // 绘制二维码
                wx.downloadFile({
                  url: this.data.info.qrcode,
                  success: res=>{
                    canvas.drawImage(res.tempFilePath, 250 * ratio, 360 * ratio, 75* ratio, 75 * ratio)
                    let img = '/images/mine/poster_dot.png'
                    canvas.drawImage(img, 20 * ratio, 400 * ratio, 13 * ratio, 10* ratio)

                    canvas.setFontSize(12 * ratio)
                    canvas.setFillStyle('#B3B3B3')
                    this.data.posterTip.forEach((item,index)=>{
                      canvas.fillText(item, 40 * ratio, (420 * ratio) + index * 16 * ratio)
                    })
                    canvas.draw(true, () => {
                      // 导出图片
                      wx.canvasToTempFilePath({
                        canvasId: 'poster',
                        success: res => {
                          this.setData({
                            done: true,
                            poster: res.tempFilePath
                          })
                        }
                      })
                    })
                    wx,wx.hideLoading()
                  }
                })
              }
            })
          }
        })
      },
    })
  },
  // 修改文案
  changeTip(){
    console.log(1231)
    this.setData({
      focus: true
    })
  },
  input(e){
    this.setData({
      posterStr: e.detail.value
    })
  },
  confirm(){
    let arr = []
    for (let i = 0; i < Math.ceil(this.data.posterStr.length/16); i++){
      console.log(this.data.posterStr)
      arr.push(this.data.posterStr.substr(16*i,16))
    }
    this.createPoster()
    this.setData({
      posterTip: arr,
      focus: false
    })
    console.log(arr)
  },
  // 预览
  preview() {
    if (this.data.done) {
      wx.previewImage({
        urls: [this.data.poster]
      })
    }
  },
  // 保存
  save() {
    if (this.data.done) {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.poster,
        success: () => {
          wx.showToast({
            title: '保存成功！',
          })
        }
      })
    }
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
      title: this.data.posterStr,
      imageUrl: this.data.poster,
      path: `/pages/index/detail/detail?id=${this.data.id}`
    }
  }
})