// miniprogram/pages/uploadqrImg/uploadqrImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'../../images/default/',
    imgList:[
      'eye',
      'col2',
      'col3',
      'col4',
      'one',
      'po7',
      're7',
      'row2',
      'row3',
      'row4',
      'tian',
    ],
    cloudImglist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 上传图片
  doUpload: function (e) {
    var fileName=e.target.dataset.name;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = `${fileName}${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
})