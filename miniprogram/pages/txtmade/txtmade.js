// miniprogram/pages/qrlist/qrlist.js
import qrcode from '../../js/artqrcoed.js'

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
    styleqr:null
  },
  gettxt(e) {
    var txt = `qrinfo.text`;
    this.setData({
        [txt]: e.detail.value
    })
    wx.setStorage({
      key:"qrtxt",
      data:e.detail.value
    })
},
goqrlist() {
  wx.navigateTo({
    url: '/pages/qrlist/qrlist?pagefrom=txtmade'
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if(options.info){
      var info=JSON.parse(options.info)
      this.setData({
        styleqr:info
      })
      wx.getStorage({
        key: 'qrtxt',
        success (res) {
          console.log(res,"???")
          var txt = `qrinfo.txt`
          that.setData({
            [txt]: res.data
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