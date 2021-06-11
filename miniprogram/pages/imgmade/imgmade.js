// miniprogram/pages/qrlist/qrlist.js
import qrcode from '../../js/artqrcoed.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    styleInfo: null,
    imginfo: null,
    qrinfo: {
      canvasid: 'qrcode',
      size: '',
      text: '',
      img: ''
    },
    ifmadeqr: false,
    pbqr: false,
    pbtip: false,
    tip: "",
    checkqrimg: false
  },
  addlikenum(id) {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'reportQRLike',
      // 传给云函数的参数
      data: {
        qr_id: id
      },
      // 成功回调
      complete: (res) => {
        console.log("add 1")
      }
    })
  },
  saveimg() {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.qrinfo.size,
      height: that.data.qrinfo.size,
      canvasId: that.data.qrinfo.canvasid,
      success: function (data) {
        wx.saveImageToPhotosAlbum({
          filePath: data.tempFilePath,
          success: (res) => {
            console.log("保存成功")
          },
          fail: (err) => {}
        })
      }
    })
  },
  getsize() {
    return new Promise((resolve, reject) => {
      var that = this;
      var query = wx.createSelectorQuery();
      query.select('.qrcode').boundingClientRect(function (rect) {
        var qrsize = 'qrinfo.size'
        that.setData({
          [qrsize]: rect.height
        })
        resolve();
      }).exec();
    })
  },
  async madeImg() {
    console.log(this.data.qrinfo, "????")
    var that = this;
    if (this.data.qrinfo.img == '') {
      this.setData({
        tip: '(▼へ▼メ)请上传黑白二维码吖～',
        pbtip: true
      })
      return
    }
    if (this.data.styleInfo == null) {
      this.setData({
        tip: 'o(▼皿▼メ;)o请选择二维码风格吖～',
        pbtip: true
      })
      return
    }

    this.setData({
      pbimg: false,
      pbqr: true
    })
    await this.manageimgs();
    this.getsize().then(() => {
      this.addlikenum(this.data.styleInfo._id);
      qrcode.getqrcode(this.data.qrinfo, this.data.imginfo).then(() => {
        that.setData({
          ifmadeqr: true
        })
      });
    });
  },
  // 图片转base64
  urlTobase64(imgPath) {
    return new Promise((resolve, reject) => {
      //读取图片的base64文件内容
      wx.getFileSystemManager().readFile({
        filePath: imgPath, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: (res) => {
          var data = res.data;
          resolve(data)
        }, //成功的回调
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  // 上传单张图片
  uploadSingleImg(base64) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'uploadImg',
        // 传给云函数的参数
        data: {
          file_data: base64
        },
        // 成功回调
        complete: (res) => {
          resolve(res.result.fileID)
        }
      })
    })
  },
  uploadimg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          pbtip: true,
          checkqrimg: true,
          tip: "正在检验二维码中٩(๑❛ᴗ❛๑)۶"
        })
        var imgurl = res.tempFilePaths[0];
        // 图片转base64
        that.urlTobase64(imgurl).then(data => {
          // 上传单个图片
          that.uploadSingleImg(data).then(imgfileId => {
            // 扫码识别 s
            wx.cloud.callFunction({
              // 需调用的云函数名
              name: 'decode',
              // 传给云函数的参数
              data: {
                fileid: imgfileId
              },
              // 成功回调
              complete: (res) => {
                var qrdata = res.result;
                if (qrdata.length > 0) {
                  var qrimg = `qrinfo.img`
                  var qrtext = `qrinfo.text`
                  var text = qrdata[0].data;
                  that.setData({
                    [qrimg]: imgurl,
                    [qrtext]: text
                  })
                  wx.setStorage({
                    key: "qrimg",
                    data: imgurl
                  })
                  wx.setStorage({
                    key: "qrtxt",
                    data: text
                  })
                  that.setData({
                    pbtip: false,
                    checkqrimg: false,
                    tip: "٩(๑❛ᴗ❛๑)۶"
                  })
                } else {
                  var qrimg = `qrinfo.img`

                  that.setData({
                    pbtip: true,
                    checkqrimg: false,
                    tip: "我怀疑你上传的是假的二维码(╥╯^╰╥)，请重新上传一个真的好不？",
                    [qrimg]:''
                  })
                }
              }
            })
            // 扫码识别 e
          });
        })
      }
    })
  },
  goqrlist() {
    wx.navigateTo({
      url: '/pages/qrlist/qrlist?pagefrom=imgmade'
    })
  },
  close() {
    this.setData({
      pbqr: false,
      pbtip: false,
      ifmadeqr: false
    })
  },
  async manageimgs() {
    var info = this.data.styleInfo;
    var imgs = {
      eye: info.eye,
      one: info.one,
      tian: info.tian,
      col2: info.col2,
      col3: info.col3,
      col4: info.col4,
      row2: info.row2,
      row3: info.row3,
      row4: info.row4,
      re7: info.re7,
      po7: info.po7,
    }
    for (const key in imgs) {
      if (imgs.hasOwnProperty(key)) {
        const element = imgs[key];
        if (element) {
          await wx.cloud.downloadFile({
            fileID: element
          }).then(res => {
            imgs[key] = res.tempFilePath;
          }).catch(error => {})
        }

      }
    }
    this.setData({
      imginfo: imgs
    })
    console.log(this.data.imginfo, this.data.styleInfo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.info) {
      var info = JSON.parse(options.info)
      this.setData({
        styleInfo: info
      })
      wx.getStorage({
        key: 'qrimg',
        success(res) {
          var img = `qrinfo.img`
          that.setData({
            [img]: res.data
          })
        }
      })
      wx.getStorage({
        key: 'qrtxt',
        success(res) {
          var text = `qrinfo.text`
          that.setData({
            [text]: res.data
          })
        }
      })
    }
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
  onShareAppMessage: function () {

  }
})