// pages/index/getRed/getRed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress:[
      {
        avatar: '',
        money: '?'
      },
      {
        avatar: '',
        money: '?'
      },
      {
        avatar: '',
        money: '?'
      },
      {
        avatar: '',
        money: '?'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id != undefined) { //分享入口
      this.setData({
        id: options.id
      })
      getApp().globalData.orderRed = {
        id: options.id
      }
    } else { //登录返回
      this.setData({
        money: getApp().globalData.shareRed.money,
        time: getApp().globalData.shareRed.time,
        id: getApp().globalData.shareRed.id
      })
    }
    // 登录验证
    getApp().init(() => {
      // 领取红包
      this.getRed(this.data.id)
    })

    this.getVidio()
  },
  //领取红包
  getRed(id) {
    let url = '/api/red_packet/receiveOrderRedPacekt'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      red_id: id
    }).then(data => {
      let info = data.receive_info
      let progress = data.progress
      info.money = (parseFloat(info.money) / 100).toFixed(2)
      progress.forEach((item,index) => {
        item.money = (parseFloat(item.money) / 100).toFixed(2)
        this.data.progress[index] = item
      })
      this.setData({
        info: info,
        progress: this.data.progress
      })
      if(progress.length==4){
        wx.showModal({
          content: '你来晚了，已被瓜分完！',
          success: res=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
      }
    })
  },
  // 获取视频
  getVidio(){
    let url = '/api/public/getVideo'
    getApp().get(url).then(data=>{
      console.log(data)
      this.setData({
        vidioSrc: data.url
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
      title: '一起瓜分，看看谁的手气好！' ,
      path: `/pages/index/getRed/getRed?id=${this.data.id}`,
      imageUrl: '/images/pay/pull.png'
    }
    
  }
})