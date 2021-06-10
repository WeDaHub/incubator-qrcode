// miniprogram/pages/qrlist/qrlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: null,
    limit: 10, //每页数量
    pageid: 1,
    datatype: 0,
    ifloading: false
  },
  getall() {
    this.setData({
      datatype: 0
    })
    this.firstgetdatalist();
  },
  getpublish() {
    this.setData({
      datatype: 1
    })
    this.firstgetdatalist();
  },
  getwait() {
    this.setData({
      datatype: 2
    })
    this.firstgetdatalist();
  },
  qrpublish(e) {
    var id = e.currentTarget.dataset.qrid;
    var qrpublish = !e.currentTarget.dataset.publish;
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'publishQR',
      // 传给云函数的参数
      data: {
        qr_id: id,
        publish: qrpublish
      },
      // 成功回调
      complete: (res) => {
        for (let i = 0; i < this.data.list.length; i++) {
          if (this.data.list[i]._id == id) {
            var publish = `list[${i}].publish`;
            this.setData({
              [publish]: qrpublish
            })
            break;
          }
        }
      }
    })

  },
  firstgetdatalist() {
    this.setData({
      ifloading: true
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: this.data.limit,
        page_index: 0,
        datatype: this.data.datatype,
        self: false
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        for (let i = 0; i < list.length; i++) {
          list[i].select = false;
        }
        var total = Math.ceil(res.result.data.total / this.data.limit);
        this.setData({
          total: total,
          list: list,
          ifloading: false
        })
      }
    })
  },
  getdatalist(pageid) {
    this.setData({
      ifloading: true
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: this.data.limit,
        page_index: pageid - 1,
        datatype: this.data.datatype,
        self: false
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        for (let i = 0; i < list.length; i++) {
          list[i].select = false;
        }
        var total = Math.ceil(res.result.data.total / this.data.limit);
        this.setData({
          total: total,
          list: list,
          ifloading: false
        })
      }
    })
  },
  prepage() {
    if (this.data.pageid <= this.data.total && this.data.pageid > 1) {
      this.setData({
        pageid: this.data.pageid - 1
      })
      this.getdatalist(this.data.pageid)
    }
  },
  nextpage() {
    if (this.data.pageid < this.data.total) {
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
    this.firstgetdatalist();
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
  onShareAppMessage: function () {}
})