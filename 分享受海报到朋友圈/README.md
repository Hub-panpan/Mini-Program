# 微信小程序实现生成海报并且保存本地

## 实验目标
 - 手动实现一个将邀请码画成海报
 - 将海报保存到手机相册
 - 将保存的海报分享到朋友圈


## 使用工具
- 微信开发者工具


## 开发起因

浏览知乎问答时，经常会有把回答分享给朋友或是发朋友圈的欲望和行为。而小程序目前并不支持分享到朋友圈（将来短期内也不可能会有，因为开放了小程序分享到朋友圈的功能，势必对用户造成骚扰，不符合微信的理念），因此“生成海报”的功能可以满足用户分享到朋友圈的需求。毕竟比起“在小程序里看到某个知乎问答 > 再去知乎APP搜索问题 > 然后从知乎APP分享到朋友圈”这样的流程，“保存一张图片再去发朋友圈”操作路径更短，显得方便许多。

但为什么不是生成一张能看到完整回答的图片呢？原因主要有：

回答里面可能包含视频、GIF，生成图片就无法观看了。
有些回答太长，生成图片可能造成图片太大，朋友点开查看时就可能加载过慢，影响体验。
因此通过小程序二维码解决了以上问题。同时还能给知乎小程序引流。

这里有思考过，海报上没有放下载APP的二维码，究竟是小程序的规则限制，还是企业自身利益相关（“下载APP”比“识别二维码跳转到小程序”更繁琐，操作成本较高，会导致转化率低）。经求证，原因是后者，小程序并没有限制不能放下载APP的二维码。


项目中遇到需要分享到朋友圈，但是查询api发现小程序并没有提供分享到朋友圈的功能，只能实现通过canvas画一张海报然后保存到本地，让用户主动去发朋友圈。

先看效果图
![](./yanshi.gif)


首先使用微信小程序提供的canvasapi将第二张图显示的海报画出来

然后调用保存本地的接口

wx.saveImageToPhotosAlbum({}）将图片保存在本地相册中

直接上代码

首先是index.wxml


```
<view>
  <image src="{{img}}" class='bgImg'></image>
  <text class='mine'>我的邀请码</text>
  <text class='code'>{{code}}</text>
  <text class='who'>谁邀请你一起吃面?</text>
  <view class='inputBox'>
    <input placeholder='输入朋友的验证码' class='input' bindinput='bindKeyInput'/>
    <button bindtap='btnclick' class='btn'>提交</button>
  </view>
  <text class='tishi'>输入朋友的邀请码，朋友和你各自获得通用优惠券1张</text>
  <text class='shareText'>生成海报分享至</text>
  <view class='imgBox'>
    <button open-type="share" class='zfbtn'><image src="{{wechat}}" class='img'></image></button>
    <button class='zfbtn m_l' bindtap='formSubmit'><image src="{{quan}}" class='img'></image></button>
  </view>

  <!--生成海报  -->
   <!-- <view class="img-box">
        
    </view> -->
    <view class='imagePathBox' hidden="{{maskHidden == false}}">
      <image src="{{imagePath}}" class='shengcheng'></image>
      <button class='baocun' bindtap='baocun'>保存相册，分享到朋友圈</button>
    </view>
   <view hidden="{{maskHidden == false}}" class="mask"></view> 
  <view class="canvas-box">
      <canvas  style="width: 375px;height: 667px;position:fixed;top:9999px" canvas-id="mycanvas"/>
  </view>  
</view>
```

然后是index.wxss


```
.bgImg{
  display: block;
  width: 100%;
  height: 366rpx;
}
.mine{
  display: block;
  text-align: center;
  color: #333;
  margin-top: 44rpx;
}
.code{
  display: block;
  text-align: center;
  color: #333;
  font-size: 76rpx;
  font-weight: bold;
  margin-top: 30rpx;
}
.who{
  display: block;
  margin-top: 80rpx;
  font-size: 32rpx;
  color: #333;
  text-align: center;
}
.inputBox{
  text-align: center;
  margin-top: 44rpx;
}
.input{
  text-align: center;
  width: 440rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f5f5f5;
  font-size: 32rpx;
  display: inline-block;
}
.btn{
  width: 160rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background:linear-gradient(90deg,rgba(255,226,0,1),rgba(255,200,11,1));
  box-shadow: 0px 4px 8px 0px rgba(255,200,11,0.5); 
  color:#333;
  font-size: 32rpx;
  display: inline-block;
  line-height: 88rpx;
  margin-left: 40rpx;
}
button[class="btn"]::after {
  border: 0;
} 
.tishi{
  display: block;
  text-align: center;
  color: #999;
  margin-top: 30rpx;
}
.shareText{
  display: block;
  text-align: center;
  color: #333;
  font-size: 28rpx;
  margin-top: 100rpx;
}
.imgBox{
  text-align: center;
  width: 100%;
  margin-top:60rpx;
  padding-bottom: 120rpx;
}
.img{
  display: inline-block;
  width: 100%;
  height: 100%;
}
.m_l{
  margin-left: 180rpx;
}
.zfbtn{
  display: inline-block;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: transparent;
  outline: none;
  border: 0;
  padding: 0;
}
button[class="zfbtn"]::after {
  border: 0;
} 
button[class="zfbtn m_l"]::after {
  border: 0;
} 
.imagePathBox{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.shengcheng{
  width: 80%;
  height: 80%;
  position: fixed;
  top: 50rpx;
  left: 50%;
  margin-left: -40%;
  z-index: 10;
}
.baocun{
  display: block;
  width: 80%;
  height: 80rpx;
  padding: 0;
  line-height: 80rpx;
  text-align: center;
  position: fixed;
  bottom: 50rpx;
  left: 10%;
  background: #ffe200;
  color: #333;
  font-size: 32rpx;
  border-radius: 44rpx;
}
button[class="baocun"]::after{
  border: 0;
}
```

最后是index.js


```
// pages/prize/prize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:"../../images/gobg.png",
    wechat:"../../images/wechat.png",
    quan:"../../images/quan.png",
    code:"E7AI98",
    inputValue:"",
    maskHidden: false,
    name:"",
    touxiang:"",
    code: "E7A93C"
  },
  //获取输入框的值
  bindKeyInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  //点击提交按钮
  btnclick:function(){
    var text = this.data.inputValue
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo,"huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })

  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffe200")
    context.fillRect(0, 0, 375, 667)
    var path = "/images/gobg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 183);
    var path1 = that.data.touxiang;
    console.log(path1,"path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = "/images/txquan.png";
    var path3 = "/images/heise.png";
    var path4 = "/images/wenziBg.png";
    var path5 = "/images/wenxin.png";
    context.drawImage(path2, 126, 186, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    var name = that.data.name;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 185, 340);
    context.stroke();
    //绘制一起吃面标语
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText("邀请你一起去吃面", 185, 370);
    context.stroke();
    //绘制验证码背景
    context.drawImage(path3, 48, 390, 280, 84);
    //绘制code码
    context.setFontSize(40);
    context.setFillStyle('#ffe200');
    context.setTextAlign('center');
    context.fillText(that.data.code, 185, 435);
    context.stroke();
    //绘制左下角文字背景图
    context.drawImage(path4, 25, 520, 184, 82);
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("进入小程序输入朋友的邀请", 35, 540);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("码，朋友和你各自获得通用", 35, 560);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("优惠券1张哦~", 35, 580);
    context.stroke();
    //绘制右下角扫码提示语
    context.drawImage(path5, 248, 578, 90, 25);
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun:function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },fail:function(res){
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '装逼中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title:"这个是我分享出来的东西",
      success:function(res){
        console.log(res,"转发成功")
      },
      fail:function(res){
        console.log(res,"转发失败")
      }
    }
  }
})
```

代码里面有一部分不是关于生成图片的，没有去详细分，可以看情况去删减。

到此就完成了canvas画海报并且保存相册功能 

其中用到的图

## 个人总结

总结学习感觉很不错