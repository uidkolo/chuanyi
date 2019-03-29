// pages/mine/order/discuss/discuss.js
const uploadImage = require('../../../../utils/uploadFile.js')
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      scene: options.scene
    })
    this.getGoods(options.id)
  },
  //获取商品 
  getGoods(id) {
    let url = '/api/comment/commentGoods'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      order_id: id
    }).then(data => {
      let list = data.list
      list.forEach(item => {
        item.imgs = []
        item.content = ''
      })
      this.setData({
        goods: list
      })
    })
  },
  // 选择图片
  chooseImg(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.goods[index].imgs.length < 4) {
      wx.chooseImage({
        count: 1,
        success: res => {
          this.uploadImg(res.tempFilePaths[0]).then(url => {
            this.data.goods[index].imgs.push(url)
            this.setData({
              goods: this.data.goods
            })
          })
        },
      })
    }else{
      wx.showToast({
        title: '最多4张',
        image: '/images/tip.png'
      })
    }
  },
  //上传图片
  uploadImg: function(file) {
    return new Promise((resolve, reject) => {
      var nowTime = util.formatTime(new Date());
      uploadImage(file, 'images/' + nowTime + '/',
        function(result) {
          resolve(result)
        },
        function(result) {
          console.log("======上传失败======", result);
        }
      )
    })
  },
  // 删除图片
  delete(e){
    let index= e.currentTarget.dataset.index
    let index2 = e.currentTarget.dataset.index2
    this.data.goods[index].imgs.splice(index2,1)
    this.setData({
      goods: this.data.goods
    })
  },
  // 输入
  input(e){
    let index = e.currentTarget.dataset.index
    this.data.goods[index].content = e.detail.value
    this.setData({
      goods: this.data.goods
    })
  },
  // 发表评价
  discuss(){
    let discusses = []
    let test = true
    this.data.goods.forEach(item=>{
      if(item.content==''){
        test = false
      }
      discusses.push({
        content: item.content,
        imgs: item.imgs,
        goods_id: item.goods_id
      })
    })
    if(test){
      wx.showLoading({
        title: '正在评价',
      })
      let url = '/api/comment/orderComment'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        comment_json: JSON.stringify(discusses)
      }).then(()=>{
        wx.hideLoading()
        wx.navigateBack({
          delta: parseInt(this.data.scene)
        })
      })
    }else{
      wx.showToast({
        title: '内容不为空',
        image: '/images/tip.png'
      })
    }
  },
  // 预览
  preview(e){
    let index = e.currentTarget.dataset.index
    let index2 = e.currentTarget.dataset.index2
    let urls = this.data.goods[index].imgs
    wx.previewImage({
      urls: urls,
      current: urls[index2]
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