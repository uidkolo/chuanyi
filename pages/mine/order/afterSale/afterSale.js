// pages/mine/order/afterSale/afterSale.js
const uploadImage = require('../../../../utils/uploadFile.js')
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    wayContent: '选择退货方式',
    way: '',
    reasonContent: '选择售后原因',
    reason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    if(options.scene==1){ // 修改
      this.getOldInfo(options.id)
      this.setData({
        scene: options.scene
      })
    }else{
      
      this.getGoodsInfo(options.id)
    }
  },
  // 获取商品信息
  getGoodsInfo(id) {
    let url = '/api/goods_return/goodsReturnInfo'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      goods_id: id
    }).then(data => {
      let dataObj = data
      let way = []
      let reason = []
      for (let i in dataObj.goods_return_way) {
        way.push(dataObj.goods_return_way[i])
      }
      for (let i in dataObj.goods_return_reason) {
        reason.push(dataObj.goods_return_reason[i])
      }
      dataObj.goods_return_way = way
      dataObj.goods_return_reason = reason

      dataObj.max_return_money = parseFloat(dataObj.max_return_money / 100).toFixed(2)
      this.setData({
        info: dataObj
      })
    })
  },
  // 修改信息入口查询信息
  getOldInfo(id){
    let url = '/api/goods_return/updateApply'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      return_id: id
    }).then(data=>{
      let dataObj = data.return_info
      let way = []
      let reason = []
      for (let i in dataObj.goods_return_way) {
        way.push(dataObj.goods_return_way[i])
      }
      for (let i in dataObj.goods_return_reason) {
        reason.push(dataObj.goods_return_reason[i])
      }
      dataObj.goods_return_way = way
      dataObj.goods_return_reason = reason

      dataObj.max_return_money = parseFloat(dataObj.max_return_money / 100).toFixed(2)
      this.setData({
        info: dataObj,
        way: dataObj.way,
        wayContent: way[dataObj.way-1],
        reason: dataObj.reason,
        reasonContent: reason[dataObj.reason - 1],
        explain: dataObj.explain,
        imgs: dataObj.imgs
      })
    })
  },
  // 选择退款方式
  pickerWay(e) {
    console.log(e.detail)
    this.setData({
      way: parseInt(e.detail.value) + 1,
      wayContent: this.data.info.goods_return_way[e.detail.value]
    })
  },
  // 选择退款原因
  pickerReason(e) {
    this.setData({
      reason: parseInt(e.detail.value) + 1,
      reasonContent: this.data.info.goods_return_reason[e.detail.value]
    })
  },
  // 输入
  input(e) {
    this.setData({
      explain: e.detail.value
    })
  },
  // 申请售后
  apply() {
    if (!this.data.way) {
      wx.showToast({
        title: '请选择退货方式',
        image: '/images/tip.png'
      })
    } else if(!this.data.reason){
      wx.showToast({
        title: '请选择售后原因',
        image: '/images/tip.png'
      })
    } else if(this.data.imgs.length==0){
      wx.showToast({
        title: '请上传凭证',
        image: '/images/tip.png'
      })
    }else{
      let url = '/api/goods_return/customeService'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        goods_id: this.data.id,
        way: this.data.way,
        reason: this.data.reason,
        money: this.data.info.max_return_money,
        explain: this.data.explain,
        imgs: JSON.stringify(this.data.imgs)
      }).then(() => {
        wx.redirectTo({
          url: '/pages/mine/afterSaleList/afterSaleList',
        })
      })
    }
  },
  // 修改售后信息
  changeApply() {
    if (!this.data.way) {
      wx.showToast({
        title: '请选择退货方式',
        image: '/images/tip.png'
      })
    } else if (!this.data.reason) {
      wx.showToast({
        title: '请选择售后原因',
        image: '/images/tip.png'
      })
    } else if (this.data.imgs.length == 0) {
      wx.showToast({
        title: '请上传凭证',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/goods_return/saveAgainApply'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        return_id: this.data.id,
        way: this.data.way,
        reason: this.data.reason,
        money: this.data.info.max_return_money,
        explain: this.data.explain,
        imgs: JSON.stringify(this.data.imgs)
      }).then(() => {
        wx.redirectTo({
          url: '/pages/mine/afterSaleList/afterSaleList',
        })
      })
    }
  },
  // 选择图片
  chooseImg(e) {
    if (this.data.imgs.length < 4) {
      wx.chooseImage({
        count: 1,
        success: res => {
          this.uploadImg(res.tempFilePaths[0]).then(url => {
            this.data.imgs.push(url)
            this.setData({
              imgs: this.data.imgs
            })
          })
        },
      })
    } else {
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
  // 预览
  preview(e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.imgs,
      current: this.data.imgs[index]
    })
  },
  // 删除图片
  delete(e) {
    let index = e.currentTarget.dataset.index
    this.data.imgs.splice(index, 1)
    this.setData({
      imgs: this.data.imgs
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