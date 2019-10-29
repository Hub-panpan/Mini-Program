const lottie = require('../../mini_npm/miniprogram_npm/lottie-miniapp/index.js').default

const animationData = require('../../lottie.js');



Page({

  data: {},

  onLoad: function () {

    const canvasContext = wx.createCanvasContext('test-canvas');

    canvasContext.canvas = {

      width: 375,

      height: 375

    };

    //如果同时指定animationData和path，优先取animationData

    lottie.loadAnimation({

      renderer: 'canvas', // 只支持canvas

      loop: true,

      autoplay: true,

      animationData: animationData,

      rendererSettings: {

        context: canvasContext,

        clearCanvas: true

      }

    })

  }

})