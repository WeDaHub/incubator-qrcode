//app.js
App({
  globalData: {},
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },
  gettoken() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxdb5a9d708acf35ee&secret=731ce47411ac051989925ed55854c528', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          resolve(res.data.access_token);
        },
        fail() {
          reject();
        }
      })
    })
  },
  scanqrcode(img) {
    return new Promise((resolve, reject) => {
      this.gettoken().then(res => {
        wx.request({
          url: `https://api.weixin.qq.com/cv/img/qrcode?img_url=${img}&access_token=${res}`, //仅为示例，并非真实的接口地址
          img: {
            contentType: 'image/png'
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            resolve(res)
          },
          fail() {
            reject()
          }
        })
      })
    })

  },
  getimg(token, fileid) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${token}`, //仅为示例，并非真实的接口地址
        data: {
          "env": "xier-8gptzwg769125208",
          "file_list": [{
            "fileid": fileid,
            "max_age": 7200
          }]
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          var img = res.data.file_list[0].download_url;
          resolve(img)
        }
      })
    })
  }
})