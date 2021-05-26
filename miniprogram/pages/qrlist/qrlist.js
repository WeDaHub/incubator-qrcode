// miniprogram/pages/qrlist/qrlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: null,
    limit: 6, //每页数量
    pageid: 1,
  },
  goqrcode(e) {
    var data = JSON.stringify(e.currentTarget.dataset.info)
    wx.navigateTo({
      url: `/pages/qrcode/qrcode?info=${data}`
    })
  },
  firstgetdatalist() {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: this.data.limit,
        page_index: this.data.pageid - 1,
        self: false
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        var total = Math.ceil(res.result.data.total / this.data.limit);
        this.setData({
          total: total,
          list: list,
        })
      }
    })
  },
  getdatalist(pageid) {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: this.data.limit,
        page_index: pageid - 1,
        self: false
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        var total = Math.ceil(res.result.data.total / this.data.limit);
        this.setData({
          total: total,
          list: list,
        })
      }
    })
  },
  prepage() {
    if (this.data.pageid <= this.data.total&&this.data.pageid>1) {
      this.setData({
        pageid: this.data.pageid - 1
      })
      this.getdatalist(this.data.pageid)
    }
  },
  nextpage(){
    if(this.data.pageid<this.data.total){
      this.setData({
        pageid: this.data.pageid + 1
      })
      this.getdatalist(this.data.pageid)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.firstgetdatalist()
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