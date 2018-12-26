//app.js
App({
  onLaunch: function() {
    this.init()
  },
  globalData: {

  },
  // 初始化
  init() {
    this.login().then(token => {
      this.getUserInfo(token).then(userInfo => {
        if (userInfo == undefined) {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        } else {
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
        }
      })
    })
  },
  // 获取用户信息
  getUserInfo(token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://cy.nulizhe.com/api/User/getUserInfo',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: {
          token: token
        },
        success(res) {
          resolve(res.data.data)
        }
      })
    })
  },
  // 获取openId和token
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          wx.request({
            url: 'https://cy.nulizhe.com/Api/User/loginCheck',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            data: {
              code: res.code
            },
            success: res => {
              if (res.data.code == 1) {
                wx.setStorageSync('openId', res.data.data.openid)
                wx.setStorageSync('auth_token', res.data.data.auth_token)
                resolve(res.data.data.auth_token)
              } else {
                wx.showToast({
                  title: res.data.message,
                  image: '/images/tip.png'
                })
              }
            }
          })
        }
      })
    })
  }
})