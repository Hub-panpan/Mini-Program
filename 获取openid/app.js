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
        var code = res.code;
        //debugger;
        if (code) {
          //发送code到后台，分析openid
          wx.request({
            //url: 'http://localhost:8888/login/regist?code=' + code,
            url: 'https://localhost:8888/mobile/getJsonString',
            method: 'Get',
            data:{
              "params": {bic: "0006", userId: "178541687061", id: "17854168706", password: "12345644" ,"code":code},
             
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //debugger;
              console.log(res);
              console.log(res.data);
              console.log(res.data.data);

              var obj = JSON.parse(res.data.data);

              console.log(obj);
              if (obj.result == 'fail') {
                //status为空时登录凭证code为空
                wx.showToast({
                  title: '登录凭证code为空...',
                  icon: "none",
                  duration: 2500
                })
              } else if (obj.result == 'succeed') {
                //status为1时openid已存在
                this.globalData.userInfo = res.data.userInfo;
                console.log(userInfo);
              }
            }
          })
        }
    

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
  globalData: {
    userInfo: null
  }
})