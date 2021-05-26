// miniprogram/pages/upload/upload.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      name: "cover",
      temporary: "",
      fileId: "",
      url: '../../images/qr.png',
    }, {
      name: "eye",
      temporary: "",
      fileId: "",
      url: '../../images/upload/eye.png',
    }, {
      name: "one",
      temporary: "",
      fileId: "",
      url: '../../images/upload/one.png',
    }, {
      name: "col2",
      temporary: "",
      fileId: "",
      url: '../../images/upload/col2.png',
    }, {
      name: "col3",
      temporary: "",
      fileId: "",
      url: '../../images/upload/col3.png',
    }, {
      name: "col4",
      temporary: "",
      fileId: "",
      url: '../../images/upload/col4.png',
    }, {
      name: "po7",
      temporary: "",
      fileId: "",
      url: '../../images/upload/po7.png',
    }, {
      name: "re7",
      temporary: "",
      fileId: "",
      url: '../../images/upload/re7.png',
    }, {
      name: "row2",
      temporary: "",
      fileId: "",
      url: '../../images/upload/row2.png',
    }, {
      name: "row3",
      temporary: "",
      fileId: "",
      url: '../../images/upload/row3.png',
    }, {
      name: "row4",
      temporary: "",
      fileId: "",
      url: '../../images/upload/row4.png',
    }, {
      name: "tian",
      temporary: "",
      fileId: "",
      url: '../../images/upload/tian.png',
    }],
    pbupload: false,
    pbrule: false,
    stylename:null
  },
  gettxt(e) {
    this.setData({
      stylename: e.detail.value
    })
},
  closePbUpload(e) {
    this.setData({
      pbupload: false
    })
  },
  closePbRule() {
    this.setData({
      pbrule: false
    })
  },
  // 上传风格
  upload() {
    var that = this;
    var data = {
      cover: that.data.list[0].fileId, //封面
      eye: that.data.list[1].fileId, //必填
      one: that.data.list[2].fileId, //必填
      col2: that.data.list[3].fileId,
      col3: that.data.list[4].fileId,
      col4: that.data.list[5].fileId,
      po7: that.data.list[6].fileId,
      re7: that.data.list[7].fileId,
      row2: that.data.list[8].fileId,
      row3: that.data.list[9].fileId,
      row4: that.data.list[10].fileId,
      tian: that.data.list[11].fileId,
      element_name: that.data.stylename, //必填,素材包名称
      _author_avatar: app.globalData.userInfo.avatarUrl,
      _author_name: app.globalData.userInfo.nickName //必填,用户名称
    }
    console.log(data)
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'uploadQRElement',
      // 传给云函数的参数
      data: data,
      // 成功回调
      complete: (res) => {
        console.log(res, "{{}}")
      }
    })
  },
  showpbupload() {
    this.setData({
      pbupload: true,
    })
  },
  showpbrule() {
    this.setData({
      pbrule: true,
    })
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
  // 选择单张图片
  chooseSingleImg(e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (let i = 0; i < that.data.list.length; i++) {
          if (that.data.list[i].name == name) {
            // 转成base64
            that.urlTobase64(res.tempFilePaths[0]).then(data => {
              // 上传图片
              that.uploadSingleImg(data).then(imgfileId => {
                // 上传成功后
                var temporary = `list[${i}].temporary`;
                var fileId = `list[${i}].fileId`;
                that.setData({
                  [temporary]: res.tempFilePaths[0],
                  [fileId]: imgfileId
                })
                console.log(that.data.list, ">>>>")
              });
            })
            break;
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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