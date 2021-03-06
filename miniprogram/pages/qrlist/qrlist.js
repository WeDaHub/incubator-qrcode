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
    misstype:'loading',
    misstxt:'数据加载中٩(๑❛ᴗ❛๑)۶～',
    pagefrom:'index',
  },
  gomylist() {
    wx.navigateTo({
      url: '/pages/myqrlist/myqrlist'
    })
  },
  goqrcode(e) {
    var data = JSON.stringify(e.currentTarget.dataset.info)
    if(this.data.pagefrom=='index'){
      wx.navigateTo({
        url: `/pages/qrcode/qrcode?info=${data}`
      })
    }else{
        wx.navigateTo({
          url: `/pages/${this.data.pagefrom}/${this.data.pagefrom}?info=${data}`
        })
    }
  },
  firstgetdatalist() {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQRElementList',
      // 传给云函数的参数
      data: {
        limit: this.data.limit,
        page_index: this.data.pageid - 1,
        self: false,
        datatype:1
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        var total = Math.ceil(res.result.data.total / this.data.limit);
        this.setData({
          total: total,
          list: list,
          misstype:list.length>0?'loading':'nodata',
          misstxt:list.length>0?'好看的模板在路上٩(๑❛ᴗ❛๑)۶':'数据跑哪里了呢？(╥╯^╰╥)',
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
        self: false,
        datatype:1
      },
      // 成功回调
      complete: (res) => {
        var list = res.result.data.list;
        var total = Math.ceil(res.result.data.total / this.data.limit);
        this.setData({
          total: total,
          list: list,
          misstype:list.length>0?'loading':'nodata',
          misstxt:list.length>0?'好看的模板在路上٩(๑❛ᴗ❛๑)۶':'数据跑哪里了呢？(╥╯^╰╥)',
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
    if(options.pagefrom=='imgmade'||options.pagefrom=="txtmade"){
      this.setData({
        pagefrom:options.pagefrom,
      })
    }else{
        this.setData({
          pagefrom:'index',
        })
    }
    this.firstgetdatalist()
  }
})