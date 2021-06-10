// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null
  },
  gotxtmade() {
    wx.navigateTo({
      url: '/pages/txtmade/txtmade'
    })
  },
  goimgmade() {
    wx.navigateTo({
      url: '/pages/imgmade/imgmade'
    })
  },
  goqrlist() {
    wx.navigateTo({
      url: '/pages/qrlist/qrlist'
    })
  },
  gomylist() {
    wx.navigateTo({
      url: '/pages/myqrlist/myqrlist'
    })
  },
  gocheck() {
    wx.navigateTo({
      url: '/pages/checkqr/checkqr'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.removeStorage({
      key: 'qrimg',
      success(res) {}
    })
    wx.removeStorage({
      key: 'qrtxt',
      success(res) {}
    })

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'login',
      // 成功回调
      complete: (res) => {
        console.log(res.result.openid)
        this.setData({
          openid:res.result.openid
        })
      }
    })

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