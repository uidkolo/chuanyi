// pages/works/userIndex/userIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end: false,
    tabIndex: 0,
    filter: 0,
    designs: [],
    pageNo: 1,
    totalPage: 1,
    postMask: false,
    moneyMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo()
    this.getDesigns()
  },
  // 获取设计师信息
  getInfo() {
    let url = '/api/designer_income/getDesignerDetailInfo'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        info: data
      })
    })
  },
  //tab
  tab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index != 2) {
      this.setData({
        filter: e.currentTarget.dataset.index,
        designs: [],
        pageNo: 1,
        totalPage: 1
      })
      this.getDesigns()
    } else {
      if (!this.data.income) {
        this.getIncomeDetail()
      }
    }
  },
  // subTab
  subTab(e) {
    this.setData({
      filter: e.currentTarget.dataset.index,
      designs: [],
      pageNo: 1,
      totalPage: 1
    })
    this.getDesigns()
  },
  // 获取我的作品
  getDesigns() {
    if (this.data.pageNo <= this.data.totalPage) {
      wx.showLoading({
        title: '正在加载',
      })
      let url = '/api/designer/designerWorks'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        filter: this.data.filter,
        page: this.data.pageNo
      }).then(data => {
        wx.hideLoading()
        let designs = data.list
        designs.forEach(item => {
          item.money = parseFloat(item.money / 100).toFixed(2)
        })
        this.data.designs = this.data.designs.concat(designs)
        this.setData({
          allCount: data.all_count,
          postCount: data.post_count,
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
  //input
  input(e) {
    this.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  // 点击发布按钮
  clickPost(e) {
    this.setData({
      postMask: true,
      workName: this.data.designs[e.currentTarget.dataset.index].clothes_name,
      currentWorkId: e.currentTarget.dataset.id,
    })
  },
  // close
  close() {
    this.setData({
      postMask: false,
      moneyMask: false
    })
  },
  // 发布
  postApply() {
    if (!this.data.workName) {
      wx.showToast({
        title: '请输入名称',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/designer/postWorksApply'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        name: this.data.workName,
        design_id: this.data.currentWorkId
      }).then(() => {
        wx.showToast({
          title: '申请成功',
          success: () => {
            this.setData({
              designs: [],
              pageNo: 1,
              totalPage: 1,
              postMask: false
            })
            this.getDesigns()
          }
        })
      })
    }
  },
  //上下架
  upOrDown(e) {
    let url = '/api/designer/worksUpOrDown'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token'),
      design_id: e.currentTarget.dataset.id,
      val: e.currentTarget.dataset.val
    }).then(() => {
      wx.showToast({
        title: `${e.currentTarget.dataset.val == 1 ? "上架" : "下架"}成功！`,
      })
      this.setData({
        designs: [],
        pageNo: 1,
        totalPage: 1
      })
      this.getDesigns()
    })
  },
  // 删除作品
  delete(e) {
    wx.showModal({
      title: '删除提示',
      content: '删除后不可恢复，确定删除？',
      success: res => {
        if (res.confirm) {
          let url = '/api/designer/deleteWorks'
          getApp().post(url, {
            token: wx.getStorageSync('auth_token'),
            design_id: e.currentTarget.dataset.id
          }).then(() => {
            wx.showToast({
              title: '删除成功！',
            })
            this.setData({
              designs: [],
              pageNo: 1,
              totalPage: 1
            })
            this.getDesigns()
          })
        }
      }
    })

  },
  // 点击修改价格
  editMoney(e) {
    this.setData({
      moneyMask: true,
      money: this.data.designs[e.currentTarget.dataset.index].money,
      currentWorkIndex: e.currentTarget.dataset.index,
      currentWorkId: e.currentTarget.dataset.id,
    })
  },
  //确认修改价格
  changeMoney() {
    if (!this.data.money) {
      wx.showToast({
        title: '请输入价格',
        image: '/images/tip.png'
      })
    } else {
      let url = '/api/designer/changeWorksMoney'
      getApp().post(url, {
        token: wx.getStorageSync('auth_token'),
        money: this.data.money,
        design_id: this.data.currentWorkId
      }).then(() => {
        wx.showToast({
          title: '修改成功',
          success: () => {
            this.data.designs[this.data.currentWorkIndex].money = this.data.money
            this.setData({
              moneyMask: false,
              designs: this.data.designs
            })
          }
        })
      })
    }
  },
  // 获取我的收益
  getIncomeDetail() {
    let url = '/api/designer_income/incomeDetail'
    getApp().post(url, {
      token: wx.getStorageSync('auth_token')
    }).then(data => {
      this.setData({
        income: data
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
    if (this.data.tabIndex != 2){
      this.getDesigns()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})