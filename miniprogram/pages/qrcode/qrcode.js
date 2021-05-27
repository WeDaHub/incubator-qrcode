// miniprogram/pages/qrcode/qrcode.js
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
        pbtxt: false,
        pbimg: false,
        pbqr: false,
        ifmadeqr: false,
    },
    saveimg() {
        var that = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.qrinfo.size,
            height: that.data.qrinfo.size,
            canvasId: that.data.qrinfo.canvasid,
            success: function (data) {
                wx.saveImageToPhotosAlbum({
                    filePath: data.tempFilePath,
                    success: (res) => {
                        console.log("保存成功")
                    },
                    fail: (err) => {}
                })
            }
        })
    },
    uploadimg() {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var img = `qrinfo.img`
                that.setData({
                    [img]: res.tempFilePaths[0]
                })
                console.log(that.data.qrinfo)
            }
        })
    },
    gettxt(e) {
        var txt = `qrinfo.text`;
        this.setData({
            [txt]: e.detail.value
        })
    },
    showpbtxt() {
        this.setData({
            pbtxt: true
        })
    },
    showpbqr() {
        this.setData({
            pbqr: true
        })
    },
    showpbimg() {
        this.setData({
            pbimg: true
        })
    },
    madeTxt() {
        var that = this;
        this.setData({
            pbtxt: false,
            pbqr: true,
        })
        this.getsize().then(() => {
            this.addlikenum(this.data.styleInfo._id);
            qrcode.getqrcode(this.data.qrinfo, this.data.imginfo).then(() => {
                that.setData({
                    ifmadeqr: true
                })
            });
        });
    },
    madeImg() {
        var that=this;
        this.setData({
            pbimg: false,
            pbqr: true
        })
        this.getsize().then(() => {
            this.addlikenum(this.data.styleInfo._id);
            qrcode.getqrcode(this.data.qrinfo, this.data.imginfo).then(() => {
                that.setData({
                    ifmadeqr: true
                })
            });
        });
    },
    addlikenum(id) {
        wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'reportQRLike',
            // 传给云函数的参数
            data: {
                qr_id: id
            },
            // 成功回调
            complete: (res) => {
                console.log("add 1")
            }
        })
    },
    close() {
        this.setData({
            pbqr: false,
            pbimg: false,
            pbtxt: false,
            ifmadeqr:false
        })
    },
    getsize() {
        return new Promise((resolve, reject) => {
            var that = this;
            var query = wx.createSelectorQuery();
            query.select('.qrcode').boundingClientRect(function (rect) {
                var qrsize = 'qrinfo.size'
                that.setData({
                    [qrsize]: rect.height
                })
                resolve();
            }).exec();
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var info = JSON.parse(options.info);
        var imgs = {
            eye: info.eye,
            one: info.one,
            tian: info.tian,
            col2: info.col2,
            col3: info.col3,
            col4: info.col4,
            row2: info.row2,
            row3: info.row3,
            row4: info.row4,
        }
        for (const key in imgs) {
            if (imgs.hasOwnProperty(key)) {
                const element = imgs[key];
                if (element) {
                    wx.cloud.downloadFile({
                        fileID: element
                    }).then(res => {
                        imgs[key] = res.tempFilePath;
                    }).catch(error => {})
                }

            }
        }
        this.setData({
            styleInfo: info,
            imginfo: imgs
        })
    }
})