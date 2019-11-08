Page({
 data: ({
  formid: "",
  openid: ""
 }),
 //获取用户的formid，用于模版消息推送
 gorRunnerLobby(event) {
  console.log("formid:  " + event.detail.formId);
  this.getOpenid();
  this.setData({
   formid: event.detail.formId
  })
 },

 //获取用户openid
 getOpenid() {
  let that = this;
  wx.cloud.callFunction({
   name: "getopenid",
   success(res) {
    console.log('云开发请求的openid', res.result.openid)
    that.setData({
     openid: res.result.openid
    })
   },
   fail(err) {
    console.log('云开发请求失败', res)
   }
  })
 },

 //测试推送
 push() {
  let openid = this.data.openid;
  let formid = this.data.formid;
  wx.request({
   url: 'http://localhost:8080/push?openid=' + openid + "&formid=" + formid,
   success(res) {
    console.log("推送结果：", res)
   },
   fail(err) {
    console.log("推送失败：", err)
   }
  })
 }
})