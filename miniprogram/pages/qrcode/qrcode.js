// miniprogram/pages/qrcode/qrcode.js
import drawQrcode from './weapp.qrcode.min.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrLength: 180,
        unit: 10,
        canvasBg: null,
        inputMessage: "1",
        arrayLength: null,
        array: [],
        array4: {
            row: null,
            col: null
        },
        array3: {
            row: null,
            col: null
        },
        array2: {
            row: null,
            col: null
        },
        arrayRever7: [], //反7
        arrayPositive7: [], //正7
        arrayTian: [], //田
        array1: [], //单1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            canvasBg: wx.createCanvasContext('qrcode')
        })
        this.getCanvas();
    },
    //   获得canvas对象
    getCanvas() {
        var qrcode = drawQrcode({
            width: 400,
            height: 400,
            canvasId: 'myQrcode',
            text: '1'
        })
        this.data.array = [];
        var array = [];
        var n = 0;
        for (let i = 0; i < qrcode[1]; i++) {
            array[i] = [];
            // 首先遍历tr数组
            for (let j = 0; j < qrcode[1]; j++) {
                array[i][j] = []; //第一个是上色情况，第二个是记录情况
                // 遍历每个tr里的td，记录每个td的上色情况；
                if (qrcode[0][n] == 1) {
                    array[i][j][0] = 1;
                    array[i][j][1] = 0;
                } else {
                    array[i][j][0] = 0;
                    array[i][j][1] = 1;
                }
                n++;
                // 首先把3个大框框保存下来；
                if ((i < 7 && j < 7) || (i > qrcode[1] - 8 && j < 8) || (i < 8 && j > qrcode[1] - 8)) {
                    array[i][j][1] = 1;
                }
            }
        }
        this.setData({
            array: array,
            arrayLength: qrcode[1]
        })
        this.countType("array4", 4)
        this.countTian();
        this.countType("array3", 3)
        this.count7();
        this.countType("array2", 2)
        this.count1();
        this.painEye(this.data.canvasBg, '../../images/img/eye.png', this.data.arrayLength, this.data.unit);
        console.log(this.data.canvasBg, '../../images/img/eye.png', this.data.arrayLength, this.data.unit);
    },
    // 绘制艺术二维码
    pain(arrayName, width, height, num, type) {
        // console.log(arrayName, width, height, num, type)
        var img = this.imgSrc(num, type);
        //以Canvas画布上的坐标(10,10)为起始点，绘制图像 //图像的宽度和高度分别缩放到350px和100px
        if (arrayName.length != 0) {
            for (let i = 0; i < arrayName.length; i++) {
                this.data.canvasBg.drawImage(img, arrayName[i][0] * this.data.unit, arrayName[i][1] * this.data.unit, width * this.data.unit, height * this.data.unit);
            }
        } else {
            return;
        }
    },
    // 绘制艺术二维码
    // 对象，图片，长度，单元尺寸
    painEye(ctx, eyeImguUrl, datalistlength, unit) {
        ctx.drawImage(eyeImguUrl, 0, 0, 7 * unit, 7 * unit);
        ctx.drawImage(eyeImguUrl, (datalistlength - 7) * unit, 0 * unit, 7 * unit, 7 * unit);
        console.log(eyeImguUrl, (datalistlength - 7) * unit, 0 * unit, 7 * unit, 7 * unit);
        ctx.drawImage(eyeImguUrl, 0 * unit, (datalistlength - 7) * unit, 7 * unit, 7 * unit);
        ctx.draw();
    },
    // 返回图片src
    imgSrc(num, type) {
        if (num == 4 && type == "row") {
            return "../../images/img/row4.png";
        }
        if (num == 4 && type == "col") {
            return "../../images/img/col4.png";
        }
        if (num == 3 && type == "row") {
            return "../../images/img/row3.png";
        }
        if (num == 3 && type == "col") {
            return "../../images/img/col3.png";
        }
        if (num == 7 && type == "re") {
            return "../../images/img/re7.png";
        }
        if (num == 7 && type == "po") {
            return "../../images/img/po7.png";
        }
        if (num == 22 && type == "tian") {
            return "../../images/img/tian.png";
        }
        if (num == 2 && type == "row") {
            return "../../images/img/row2.png";
        }
        if (num == 2 && type == "col") {
            return "../../images/img/col2.png";
        }
        if (num == 1 && type == "one") {
            return "../../images/img/one.png";
        }
    },
    /*
     * 返回判断条件；当数量为4、3、2个方块的；
     * 类型有：col和row；
     * i,j此时遍历的条件；
     */
    condition(arraylist, num, type, i, j) {
        if (num == 4 && type == "row") {
            return (arraylist[i][j][0] == 1 &&
                arraylist[i][j][1] == 0 &&
                arraylist[i][j + 1][0] == 1 &&
                arraylist[i][j + 1][1] == 0 &&
                arraylist[i][j + 2][0] == 1 &&
                arraylist[i][j + 2][1] == 0 &&
                arraylist[i][j + 3][0] == 1 &&
                arraylist[i][j + 3][1] == 0)
        }
        if (num == 4 && type == "col") {
            return (arraylist[i][j][0] == 1 &&
                arraylist[i][j][1] == 0 &&
                arraylist[i + 1][j][0] == 1 &&
                arraylist[i + 1][j][1] == 0 &&
                arraylist[i + 2][j][0] == 1 &&
                arraylist[i + 2][j][1] == 0 &&
                arraylist[i + 3][j][0] == 1 &&
                arraylist[i + 3][j][1] == 0)
        }
        if (num == 3 && type == "row") {
            return (arraylist[i][j][0] == 1 &&
                arraylist[i][j][1] == 0 &&
                arraylist[i][j + 1][0] == 1 &&
                arraylist[i][j + 1][1] == 0 &&
                arraylist[i][j + 2][0] == 1 &&
                arraylist[i][j + 2][1] == 0)
        }
        if (num == 3 && type == "col") {
            return (arraylist[i][j][0] == 1 &&
                arraylist[i][j][1] == 0 &&
                arraylist[i + 1][j][0] == 1 &&
                arraylist[i + 1][j][1] == 0 &&
                arraylist[i + 2][j][0] == 1 &&
                arraylist[i + 2][j][1] == 0)
        }
        if (num == 2 && type == "row") {
            return (arraylist[i][j][0] == 1 &&
                arraylist[i][j][1] == 0 &&
                arraylist[i][j + 1][0] == 1 &&
                arraylist[i][j + 1][1] == 0)
        }
        if (num == 2 && type == "col") {
            return (arraylist[i][j][0] == 1 &&
                arraylist[i][j][1] == 0 &&
                arraylist[i + 1][j][0] == 1 &&
                arraylist[i + 1][j][1] == 0)
        }
    },
    /*
     *返回判断条件；当数量为4、3、2个方块的；
     * 类型有：col和row；
     * i,j此时遍历的条件；
     */
    countType(arrayType, num) {
        var col = 0;
        this.data[arrayType].col = [];
        var row = 0;
        this.data[arrayType].row = [1, 2];

        for (let i = 0; i < this.data.arrayLength; i++) {
            //   遍历每一个数组里的值
            for (let j = 0; j < this.data.arrayLength; j++) {
                // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
                if (this.data.array[i][j][1] == 1) {
                    continue;
                } else {
                    // 随机记录行竖4
                    if (parseInt(Math.random() * 2) == 1) {
                        // 判断是否超出；
                        if (i >= this.data.arrayLength - num) {
                            continue;
                        } else {
                            // 否则判断他是否是竖4。
                            if (this.condition(this.data.array, num, "col", i, j)) {
                                // 现在col4已经被记录了；
                                for (let k = 0; k < num; k++) {
                                    this.data.array[i + k][j][1] = 1
                                }
                                // 把竖4的i，j记录进去；
                                // 开始收收集4行的小方块数据；
                                this.data[arrayType].col[col] = [];
                                this.data[arrayType].col[col][0] = j;
                                this.data[arrayType].col[col][1] = i
                                col = col + 1;
                            } else {
                                continue;
                            }
                        }
                    } else {
                        if (j >= this.data.arrayLength - num) {
                            continue;
                        } else {

                            if (this.condition(this.data.array, num, "row", i, j)) {
                                // 现在row4已经被记录了；
                                for (let k = 0; k < num; k++) {
                                    this.data.array[i][j + k][1] = 1
                                }
                                // 把横4的i，j记录进去；
                                this.data[arrayType].row[row] = [];
                                this.data[arrayType].row[row][0] = j;
                                this.data[arrayType].row[row][1] = i
                                row = row + 1;
                            } else {
                                continue;
                            }
                        }
                    }
                }
            }
        }
        // console.log(this.data[arrayType.row])
        // console.log(this.data[arrayType.col])
        this.pain(this.data[arrayType].row, num, 1, num, "row");
        this.pain(this.data[arrayType].col, 1, num, num, "col");
    },
    // 统计田
    countTian() {
        var tian = 0;
        this.data.arrayTian = [];
        for (let i = 0; i < this.data.arrayLength - 2; i++) {
            //   遍历每一个数组里的值
            for (let j = 0; j < this.data.arrayLength - 2; j++) {
                // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
                if (this.data.array[i][j][1] == 1) {
                    continue;
                } else {
                    if (
                        this.data.array[i][j][0] == 1 &&
                        this.data.array[i][j][1] == 0 &&
                        this.data.array[i + 1][j][0] == 1 &&
                        this.data.array[i + 1][j][1] == 0 &&
                        this.data.array[i][j + 1][0] == 1 &&
                        this.data.array[i][j + 1][1] == 0 &&
                        this.data.array[i + 1][j + 1][0] == 1 &&
                        this.data.array[i + 1][j + 1][1] == 0) {
                        // 现在positive7已经被记录了；
                        this.data.array[i][j][1] = 1
                        this.data.array[i + 1][j][1] = 1
                        this.data.array[i][j + 1][1] = 1
                        this.data.array[i + 1][j + 1][1] = 1
                        // 把竖7的i，j记录进去；
                        // 开始收收集7行的小方块数据；
                        this.data.arrayTian[tian] = [];
                        this.data.arrayTian[tian][0] = j;
                        this.data.arrayTian[tian][1] = i
                        tian = tian + 1;
                    } else {
                        continue;
                    }
                }
            }
        }
        this.pain(this.data.arrayTian, 2, 2, 22, "tian");
    },
    // 统计方块反7正7的个数
    count7() {
        var positive7 = 0;
        this.data.arrayPositive7 = [];
        var reverse7 = 0;
        this.data.arrayRever7 = [];
        for (let i = 0; i < this.data.arrayLength - 2; i++) {
            //   遍历每一个数组里的值
            for (let j = 0; j < this.data.arrayLength - 2; j++) {
                // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
                if (this.data.array[i][j][1] == 1) {
                    continue;
                } else {
                    // 随机记录正反7
                    if (parseInt(Math.random() * 2) == 1) {
                        // 判断是否超出；
                        // 否则判断他是否是正7。
                        if (this.data.array[i][j][0] == 1 &&
                            this.data.array[i][j][1] == 0 &&
                            this.data.array[i + 1][j][0] == 0 &&
                            this.data.array[i][j + 1][0] == 1 &&
                            this.data.array[i][j + 1][1] == 0 &&
                            this.data.array[i + 1][j + 1][0] == 1 &&
                            this.data.array[i + 1][j + 1][1] == 0) {
                            // 现在positive7已经被记录了；
                            this.data.array[i][j][1] = 1
                            this.data.array[i][j + 1][1] = 1
                            this.data.array[i + 1][j + 1][1] = 1
                            // 把竖7的i，j记录进去；
                            // 开始收收集7行的小方块数据；
                            this.data.arrayPositive7[positive7] = [];
                            this.data.arrayPositive7[positive7][0] = j;
                            this.data.arrayPositive7[positive7][1] = i
                            positive7 = positive7 + 1;
                        } else {
                            continue;
                        }
                    } else {
                        // 反7
                        if (this.data.array[i][j][0] == 1 &&
                            this.data.array[i][j][1] == 0 &&
                            this.data.array[i + 1][j + 1][0] == 0 &&
                            this.data.array[i][j + 1][0] == 1 &&
                            this.data.array[i][j + 1][1] == 0 &&
                            this.data.array[i + 1][j][0] == 1 &&
                            this.data.array[i + 1][j][1] == 0) {
                            // 现在positive7已经被记录了；
                            this.data.array[i][j][1] = 1
                            this.data.array[i][j + 1][1] = 1
                            this.data.array[i + 1][j][1] = 1
                            // 把竖7的i，j记录进去；
                            // 开始收收集7行的小方块数据；
                            this.data.arrayRever7[reverse7] = [];
                            this.data.arrayRever7[reverse7][0] = j;
                            this.data.arrayRever7[reverse7][1] = i
                            reverse7 = reverse7 + 1;
                        } else {
                            continue;
                        }
                        // 开始收收集7行的小方块数据；
                        // 否则判断他是否是横7。
                    }
                }
            }
        }
        // console.log(this.data.arrayPositive7);
        // console.log(this.data.arrayRever7);
        this.pain(this.data.arrayRever7, 2, 2, 7, "re")
        this.pain(this.data.arrayPositive7, 2, 2, 7, "po")
    },
    // 统计剩余1单个方块
    count1() {
        var col1 = 0;
        this.data.array1 = [];
        for (let i = 0; i < this.data.arrayLength; i++) {
            //   遍历每一个数组里的值
            for (let j = 0; j < this.data.arrayLength; j++) {
                // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
                if (this.data.array[i][j][1] == 1) {
                    //     continue;
                } else {
                    this.data.array[i][j][1] = 1
                    // 剩下的按单个记录保存；
                    this.data.array1[col1] = [];
                    this.data.array1[col1][0] = j;
                    this.data.array1[col1][1] = i
                    col1 = col1 + 1;
                }
            }
        }
        this.pain(this.data.array1, 1, 1, 1, "one");
    },
})