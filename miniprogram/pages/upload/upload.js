// miniprogram/pages/upload/upload.js
import common from '../../js/common.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      name: "cover",
      temporary: "",
      fileId: "",
      url: '../../images/demo.png',
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
    stylename: null,
    pbtip: false,
    tip: "",
    isuploaded: false,
    ifgetinfo: false,
    userInfo: {
      avatarUrl: '',
      nickName: '点击获取信息'
    },
  },
  gettxt(e) {
    this.setData({
      stylename: e.detail.value
    })
  },
  close(e) {
    this.setData({
      pbupload: false,
      pbrule: false,
      pbtip: false
    })
  },
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
      _author_avatar: that.data.userInfo.avatarUrl,
      _author_name: that.data.userInfo.nickName //必填,用户名称
    }
    this.setData({
      pbupload: false,
      isuploaded: false,
      pbtip: true,
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'uploadQRElement',
      // 传给云函数的参数
      data: data,
      // 成功回调
      complete: (res) => {
        that.setData({
          isuploaded: true,
          tip: `٩(๑>◡<๑)۶ :${res.result.msg},你可以继续上传素材哟～`,
          list: [{
            name: "cover",
            temporary: "",
            fileId: "",
            url: '../../images/demo.png',
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
        })
      }
    })

  },
  check() {
    if (this.data.list[0].fileId == "" || this.data.list[1].fileId == "" || this.data.list[2].fileId == "") {
      this.setData({
        tip: '(▼へ▼メ)至少上传前三张示意图哦～，不明白可点击右上角查看设计指引哦～',
        pbtip: true,
        isuploaded: true
      })
      return;
    }
    this.setData({
      pbupload: true,
      isuploaded: false
    })
  },
  showpbupload() {
    var that = this;
    if (!this.data.ifgetinfo) {
      this.getUserProfile().then(() => {
        this.check()
      }).catch(() => {
        that.setData({
          pbtip: true,
          tip: '(╬◣д◢)不授权无法上传素材哦！',
          isuploaded: true,
          ifgetinfo: false
        })
      });
    } else {
      this.check()
    }
  },
  showpbrule() {
    wx.navigateTo({
      url: '/pages/designrule/designrule'
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
            common.urlTobase64(res.tempFilePaths[0]).then(data => {
              // 上传图片
              common.uploadSingleImg(data).then(imgfileId => {
                // 上传成功后
                var temporary = `list[${i}].temporary`;
                var fileId = `list[${i}].fileId`;
                that.setData({
                  [temporary]: res.tempFilePaths[0],
                  [fileId]: imgfileId
                })
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
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: (e) => {
        var info = JSON.parse(e.data);
        that.setData({
          userInfo: info,
          ifgetinfo:true
        })
      },
      fail: (e) => {
        that.setData({
          pbtip: true,
          tip: '٩(๑>◡<๑)۶ 请点击头像授权资料哦～',
          isuploaded: true,
          ifgetinfo: false
        })
      }
    })
  },
  getUserProfile(e) {
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
          this.setData({
            ifgetinfo: false
          })
          reject(e);
        }
      })
    })
  }
})