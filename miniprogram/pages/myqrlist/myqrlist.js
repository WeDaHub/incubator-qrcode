// miniprogram/pages/qrlist/qrlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifsetting: false,
    list: [],
    total: null,
    limit: 4, //每页数量
    pageid: 1,
    deletelist: [],
    misstxt: "数据加载中",
    misstype: 'loading',
    ifgetinfo: false,
    userInfo: {
      avatarUrl: '',
      nickName: '点击获取信息'
    },
    pbtip: false,
    tip: 'ヾ(✿ﾟ▽ﾟ)ノ'
  },
  close() {
    this.setData({
      pbtip: false,
      tip: 'ヾ(✿ﾟ▽ﾟ)ノ'
    })
  },
  goqrcode(e) {
    var data = JSON.stringify(e.currentTarget.dataset.info)
    wx.navigateTo({
      url: `/pages/qrcode/qrcode?info=${data}&pagefrom=myqrlist`
    })
  },
  delete() {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'deleteUserQR',
      // 传给云函数的参数
      data: {
        qr_id_array: this.data.deletelist
      },
      // 成功回调
      complete: (res) => {
        this.setData({
          ifsetting: false
        })
        this.firstgetdatalist();
      }
    })
  },
  firstgetdatalist() {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: this.data.limit,
        page_index: 0,
        self: true
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
          misstxt: list.length == 0 ? '暂无数据' : '数据加载中',
          misstype: list.length == 0 ? 'nodata' : 'loading',
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
        self: true
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
  goupload() {
    if (!this.data.ifgetinfo) {
      this.getUserProfile().then(() => {
        wx.navigateTo({
          url: '/pages/upload/upload'
        })
      });
    } else {
      wx.navigateTo({
        url: '/pages/upload/upload'
      })
    }
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
  select(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    for (let i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i]._id == id) {
        var selectid = `list[${i}].select`;
        this.setData({
          [selectid]: !this.data.list[i].select
        })
        break;
      }
    }
    for (let i = 0; i < this.data.deletelist.length; i++) {
      if (this.data.deletelist[i] == id) {
        this.data.deletelist.splice(i, 1);
        this.setData({
          deletelist: this.data.deletelist
        })
      }
      break;
    }
    this.data.deletelist.push(id);
    this.setData({
      deletelist: this.data.deletelist
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: (e) => {
        var info = JSON.parse(e.data);
        that.setData({
          ifgetinfo: true,
          userInfo: info
        })
      },
      fail: (e) => {
        that.setData({
          ifgetinfo: false
        })
      }
    })
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
  onShareAppMessage: function () {

  },
  getUserProfile(e) {
    var that = this;
    return new Promise((resolve, reject) => {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            ifgetinfo: true,
          })
          var info = JSON.stringify(res.userInfo);
          wx.setStorage({
              key: "userInfo",
              data: info
            }),
            resolve();
        },
        fail: (e) => {
          that.setData({
            pbtip: true,
            tip: "(╬◣д◢)不授权无法上传素材哦！"
          })
          reject(e);
        }
      })
    })
  }
})