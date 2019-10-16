//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
   // hasUserInfo: false,
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    expressNumber:null,
    expressInfo:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  btnClick:function(){
    //    console.log(this.data.expressNumber) 得到文本框的值 打印出来看是否获取到了值
    var thispage=this;
    
    //把数据动态加载过去
    app.getExpressInfo(this.data.expressNumber,function(data){
        //这就得返回的数据
        console.log(data)
        console.log("上面是返回的数据")
        thispage.setData({expressInfo:data.result.list})
        //cb(res.data)
    });
  },
  input:function(e){
    //将输入框输入的值赋值给expressNumber
      this.setData({expressNumber:e.detail.value})
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
