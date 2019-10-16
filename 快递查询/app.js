//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getExpressInfo:function(number,cb){
        wx.request({
          url: 'http://wuliu.market.alicloudapi.com/kdi?no='+number,
          data:{
          
          },
          header: {
            'Authorization':"APPCODE 428dd1a4227f41eaba576acb87b36127"
          },
          success:function(res){
            console.log(res.data)
            //把数据返回回去
            cb(res.data)
            console.log("这里是app.js")
          }
        })

        
  },


  globalData: {
    userInfo: null
  }
})