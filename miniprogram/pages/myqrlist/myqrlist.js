// miniprogram/pages/qrlist/qrlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifsetting: false,
    list:[]
  },
  getdatalist(limit, pageid) {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: limit,
        page_index: pageid,
        self: true
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        console.log(list)
        this.setData({
          list: res.result.data.list
        })
      }
    })
  },
  goupload() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    })
  },
  cancleSetting() {
    this.setData({
      ifsetting: false
    })
  },
  doSetting() {
    this.setData({
      ifsetting: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdatalist(9, 0)
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