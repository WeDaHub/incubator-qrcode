// miniprogram/pages/qrcode/qrcode.js
import qrcode from './js/artqrcoed.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        unit: 10,
        arrayLength: null,
        array: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var qrinfo = {
            canvasid: 'qrcode',
            size: 250,
            text: '1',
            img:'../../images/qr.png'
        }
        var imginfo = {
            eye: '../../images/img/eye.png',
            col2: '../../images/img/col2.png',
            col3: '../../images/img/col3.png',
            col4: '../../images/img/col4.png',
            one: '../../images/img/one.png',
            po7: '../../images/img/po7.png',
            re7: '../../images/img/re7.png',
            row2: '../../images/img/row2.png',
            row3: '../../images/img/row3.png',
            row4: '../../images/img/row4.png',
            tian: '../../images/img/tian.png',
        }
        qrcode.getqrcode(qrinfo, imginfo);
        // qrcode.changeqrcode(qrinfo, imginfo);
    }
})