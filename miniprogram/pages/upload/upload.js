// miniprogram/pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      name: "cover",
      temporary: "../../images/qr.png",
      url: '../../images/qr.png',
    }, {
      name: "eye",
      temporary: "../../images/upload/eye.png",
      url: '../../images/upload/eye.png',
    }, {
      name: "one",
      temporary: "../../images/upload/one.png",
      url: '../../images/upload/one.png',
    }, {
      name: "col2",
      temporary: "../../images/upload/one.png",
      url: '../../images/upload/col2.png',
    }, {
      name: "col3",
      temporary: "",
      url: '../../images/upload/col3.png',
    }, {
      name: "col4",
      temporary: "",
      url: '../../images/upload/col4.png',
    }, {
      name: "po7",
      temporary: "",
      url: '../../images/upload/po7.png',
    }, {
      name: "re7",
      temporary: "",
      url: '../../images/upload/re7.png',
    }, {
      name: "row2",
      temporary: "",
      url: '../../images/upload/row2.png',
    }, {
      name: "row3",
      temporary: "",
      url: '../../images/upload/row3.png',
    }, {
      name: "row4",
      temporary: "",
      url: '../../images/upload/row4.png',
    }, {
      name: "tian",
      temporary: "",
      url: '../../images/upload/tian.png',
    }],
    pbupload: true
  },
  showpbupload() {
    this.setData({
      pbupload: true,
    })
  },
  uploadimg(e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (let i = 0; i < that.data.list.length; i++) {
          if (that.data.list[i].name == name) {
            var data = `list[${i}].temporary`;
            that.setData({
              [data]: res.tempFilePaths[0]
            })
            console.log(that.data.list[i])
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