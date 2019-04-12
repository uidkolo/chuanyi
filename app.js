//app.js
App({
  onLaunch: function(options) {
    if (options.referrerInfo.extraData != undefined) {
      wx.setStorage({
        key: 'shop',
        data: options.referrerInfo.extraData.shop
      })
    }
  },
  globalData: {
    designId: null
  },
  // 初始化
  init(callback) {
    this.login().then(token => {
      this.getUserInfo(token).then(userInfo => {
        if (userInfo == undefined) { //新用户
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else { //老用户
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
          this.getShareInfo()
          if (callback) {
            callback()
          }
        }
      })
    })
  },
  // 获取用户信息
  getUserInfo(token) {
    return new Promise((resolve, reject) => {
      let url = '/api/User/getUserInfo'
      this.post(url,{
        token: token
      }).then(data=>{
        resolve(data)
      })
    })
  },
  // 获取openId和token
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          let url = '/Api/User/loginCheck'
          this.post(url, {
            code: res.code
          }).then(data=>{
            wx.setStorageSync('openId', data.openid)
            wx.setStorageSync('auth_token', data.auth_token)
            resolve(data.auth_token)
          })
        }
      })
    })
  },
  // 获取分享配置信息
  getShareInfo(){
    let url = '/api/message/shareData'
    this.post(url,{
      token: wx.getStorageSync('auth_token')
    }).then(data=>{
      wx.setStorageSync('shareInfo', data)
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://cy.nulizhe.com${url}`,
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: data==undefined?{}:data,
        success: res => {
          if (res.data.code == 1) {
            if(res.data.data){
              resolve(res.data.data)
            }else{
              resolve()
            }
          } else {
            if (res.data.message.indexOf('重新登录') != -1) {
              wx.showModal({
                title: '错误提示',
                content: res.data.message,
                success: res => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/login/login',
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: res.data.message,
                success: res => {
                  if (res.confirm) {
                    reject()
                  }
                }
              })
            }
            wx.hideLoading()
          }
        }
      })
    })
  },
  get(url,data){
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://cy.nulizhe.com${url}`,
        data: data == undefined ? {} : data,
        success: res => {
          if (res.data.code == 1) {
            if (res.data.data) {
              resolve(res.data.data)
            } else {
              resolve()
            }
          } else {
            if (res.data.message.indexOf('重新登录') != -1) {
              wx.showModal({
                title: '错误提示',
                content: res.data.message,
                success: res => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/login/login',
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: res.data.message,
                success: res => {
                  if (res.confirm) {
                    reject()
                  }
                }
              })
            }
            wx.hideLoading()
          }
        }
      })
    })
  },
})