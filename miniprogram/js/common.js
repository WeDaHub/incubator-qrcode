    // 图片转base64
    function urlTobase64(imgPath) {
      return new Promise((resolve, reject) => {
        //读取图片的base64文件内容
        wx.getFileSystemManager().readFile({
          filePath: imgPath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: (res) => {
            var data = res.data;
            resolve(data)
          }, //成功的回调
          fail: (err) => {
            reject(err)
          }
        })
      })
    }
    // 上传单张图片
    function uploadSingleImg(base64) {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'uploadImg',
          // 传给云函数的参数
          data: {
            file_data: base64
          },
          // 成功回调
          complete: (res) => {
            resolve(res.result.fileID)
          }
        })
      })
    }

    export default {
      urlTobase64,
      uploadSingleImg
    }