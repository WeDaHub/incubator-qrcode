import drawQrcode from './weapp.qrcode.min.js';
import QRDecode from './decode.js';

var datalist = [];
var datacol = null;
var unit = null;

function getqrcode(qrinfo, imginfo) {
  var qrcode = drawQrcode({
    width: qrinfo.size,
    height: qrinfo.size,
    canvasId: 1,
    text: qrinfo.text
  })
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
  // 重新赋值
  datalist = array;
  datacol = qrcode[1];
  unit = Math.ceil(qrinfo.size / datacol);
  var cyt = wx.createCanvasContext(qrinfo.canvasid)
  beginDraw(imginfo, cyt);
}

function changeqrcode(qrinfo, imginfo) {
  // 解析二维码
  var cyt = wx.createCanvasContext(qrinfo.canvasid)
  cyt.drawImage(qrinfo.img, 0, 0, qrinfo.size, qrinfo.size);
  cyt.draw();
  var gettext = getdataimg(qrinfo);
  gettext.then((res) => {
    qrinfo.text = res;
    getqrcode(qrinfo, imginfo)
  })
}

function getdataimg(qrinfo) {
  return new Promise((resolve, reject) => {
    var getdata = getimgdata(qrinfo);
    getdata.then((res) => {
      var getcodetext = new QRDecode();
      var text = getcodetext.decodeImageData(res, qrinfo.size, qrinfo.size);
      qrinfo.text = text;
      resolve(text);
    })
  })
}
//获取图片像素点
function getimgdata(qrinfo) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      wx.canvasGetImageData({
        canvasId: qrinfo.canvasid,
        x: 0,
        y: 0,
        width: qrinfo.size,
        height: qrinfo.size,
        success(res) {
          reslove(res)
        },
      })
    }, 1000)
  })
}

function beginDraw(imginfo, cyt) {
  countType(cyt, "array4", 4, imginfo);
  countTian(cyt, imginfo.tian);
  countType(cyt, "array3", 3, imginfo);
  count7(cyt, imginfo);
  countType(cyt, "array2", 2, imginfo);
  count1(cyt, imginfo.one);
  painEye(cyt, imginfo.eye, datacol, unit);
}
// 绘制艺术二维码
function pain(cyt, arrayName, width, height, img) {
  //以Canvas画布上的坐标(10,10)为起始点，绘制图像 //图像的宽度和高度分别缩放到350px和100px
  if (arrayName.length != 0) {
    for (let i = 0; i < arrayName.length; i++) {
      cyt.drawImage(img, arrayName[i][0] * unit, arrayName[i][1] * unit, width * unit, height * unit);
    }
  } else {
    return;
  }
}
// 绘制艺术二维码
// 对象，图片，长度，单元尺寸
function painEye(cyt, eyeImguUrl, datalistlength, unit) {
  cyt.drawImage(eyeImguUrl, 0, 0, 7 * unit, 7 * unit);
  cyt.drawImage(eyeImguUrl, (datalistlength - 7) * unit, 0 * unit, 7 * unit, 7 * unit);
  cyt.drawImage(eyeImguUrl, 0 * unit, (datalistlength - 7) * unit, 7 * unit, 7 * unit);
  cyt.draw();
}
/*
 * 返回判断条件；当数量为4、3、2个方块的；
 * 类型有：col和row；
 * i,j此时遍历的条件；
 */
function condition(arraylist, num, type, i, j) {
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
}
/*
 *返回判断条件；当数量为4、3、2个方块的；
 * 类型有：col和row；
 * i,j此时遍历的条件；
 */
function countType(cyt, arrayType, num, imginfo) {
  var obj = {
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
  }
  var col = 0;
  obj[arrayType].col = [];
  var row = 0;
  obj[arrayType].row = [];
  if (imginfo[`row${num}`] || imginfo[`col${num}`]) {
    for (let i = 0; i < datacol; i++) {
      //   遍历每一个数组里的值
      for (let j = 0; j < datacol; j++) {
        // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
        if (datalist[i][j][1] == 1) {
          continue;
        } else {
          // 随机记录行竖4
          if (parseInt(Math.random() * 2) == 1) {
            if (imginfo[`col${num}`]) {
              // 判断是否超出；
              if (i >= datacol - num) {
                continue;
              } else {
                // 否则判断他是否是竖4。
                if (condition(datalist, num, "col", i, j)) {
                  // 现在col4已经被记录了；
                  for (let k = 0; k < num; k++) {
                    datalist[i + k][j][1] = 1
                  }
                  // 把竖4的i，j记录进去；
                  // 开始收收集4行的小方块数据；
                  obj[arrayType].col[col] = [];
                  obj[arrayType].col[col][0] = j;
                  obj[arrayType].col[col][1] = i
                  col = col + 1;
                } else {
                  continue;
                }
              }
            } else {
              continue;
            }
          } else {
            if (imginfo[`row${num}`]) {
              if (j >= datacol - num) {
                continue;
              } else {

                if (condition(datalist, num, "row", i, j)) {
                  // 现在row4已经被记录了；
                  for (let k = 0; k < num; k++) {
                    datalist[i][j + k][1] = 1
                  }
                  // 把横4的i，j记录进去；
                  obj[arrayType].row[row] = [];
                  obj[arrayType].row[row][0] = j;
                  obj[arrayType].row[row][1] = i
                  row = row + 1;
                } else {
                  continue;
                }
              }
            } else {
              continue
            }
          }
        }
      }
    }
    if (imginfo[`col${num}`]) {
      pain(cyt, obj[arrayType].col, 1, num, imginfo[`col${num}`]);
    }
    if (imginfo[`row${num}`]) {
      pain(cyt, obj[arrayType].row, num, 1, imginfo[`row${num}`]);
    }
  } else {
    return
  }
}
// 统计田
function countTian(cyt, img) {
  if (img) {
    var tian = 0;
    var arrayTian = [];
    for (let i = 0; i < datacol - 2; i++) {
      //   遍历每一个数组里的值
      for (let j = 0; j < datacol - 2; j++) {
        // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
        if (datalist[i][j][1] == 1) {
          continue;
        } else {
          if (
            datalist[i][j][0] == 1 &&
            datalist[i][j][1] == 0 &&
            datalist[i + 1][j][0] == 1 &&
            datalist[i + 1][j][1] == 0 &&
            datalist[i][j + 1][0] == 1 &&
            datalist[i][j + 1][1] == 0 &&
            datalist[i + 1][j + 1][0] == 1 &&
            datalist[i + 1][j + 1][1] == 0) {
            // 现在positive7已经被记录了；
            datalist[i][j][1] = 1
            datalist[i + 1][j][1] = 1
            datalist[i][j + 1][1] = 1
            datalist[i + 1][j + 1][1] = 1
            // 把竖7的i，j记录进去；
            // 开始收收集7行的小方块数据；
            arrayTian[tian] = [];
            arrayTian[tian][0] = j;
            arrayTian[tian][1] = i
            tian = tian + 1;
          } else {
            continue;
          }
        }
      }
    }
    pain(cyt, arrayTian, 2, 2, img);
  } else {
    return
  }

}
// 统计方块反7正7的个数
function count7(cyt, imginfo) {
  var positive7 = 0;
  var reverse7 = 0;
  var arrayPositive7 = [];
  var arrayRever7 = [];
  if (imginfo.re7 || imginfo.po7) {
    for (let i = 0; i < datacol - 2; i++) {
      //   遍历每一个数组里的值
      for (let j = 0; j < datacol - 2; j++) {
        // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
        if (datalist[i][j][1] == 1) {
          continue;
        } else {
          // 随机记录正反7
          if (parseInt(Math.random() * 2) == 1) {
            if (imginfo.po7) {
              // 判断是否超出；
              // 否则判断他是否是正7。
              if (datalist[i][j][0] == 1 &&
                datalist[i][j][1] == 0 &&
                datalist[i + 1][j][0] == 0 &&
                datalist[i][j + 1][0] == 1 &&
                datalist[i][j + 1][1] == 0 &&
                datalist[i + 1][j + 1][0] == 1 &&
                datalist[i + 1][j + 1][1] == 0) {
                // 现在positive7已经被记录了；
                datalist[i][j][1] = 1
                datalist[i][j + 1][1] = 1
                datalist[i + 1][j + 1][1] = 1
                // 把竖7的i，j记录进去；
                // 开始收收集7行的小方块数据；
                arrayPositive7[positive7] = [];
                arrayPositive7[positive7][0] = j;
                arrayPositive7[positive7][1] = i
                positive7 = positive7 + 1;
              } else {
                continue;
              }
            } else {
              continue
            }
          } else {
            if (imginfo.re7) {
              // 反7
              if (datalist[i][j][0] == 1 &&
                datalist[i][j][1] == 0 &&
                datalist[i + 1][j + 1][0] == 0 &&
                datalist[i][j + 1][0] == 1 &&
                datalist[i][j + 1][1] == 0 &&
                datalist[i + 1][j][0] == 1 &&
                datalist[i + 1][j][1] == 0) {
                // 现在positive7已经被记录了；
                datalist[i][j][1] = 1
                datalist[i][j + 1][1] = 1
                datalist[i + 1][j][1] = 1
                // 把竖7的i，j记录进去；
                // 开始收收集7行的小方块数据；
                arrayRever7[reverse7] = [];
                arrayRever7[reverse7][0] = j;
                arrayRever7[reverse7][1] = i
                reverse7 = reverse7 + 1;
              } else {
                continue;
              }
            } else {
              continue
            }
            // 开始收收集7行的小方块数据；
            // 否则判断他是否是横7。
          }
        }
      }
    }
    if (imginfo.re7) {
      pain(cyt, arrayRever7, 2, 2, imginfo.re7)
    }
    if (imginfo.po7) {
      pain(cyt, arrayPositive7, 2, 2, imginfo.po7)
    }
  } else {
    return
  }
}
// 统计剩余1单个方块
function count1(cyt, img) {
  if (img) {
    var col1 = 0;
    var array1 = [];
    for (let i = 0; i < datacol; i++) {
      //   遍历每一个数组里的值
      for (let j = 0; j < datacol; j++) {
        // 如果这个小方块没有上色或者这个小方块被记录过了，那么我们就不用管它了！
        if (datalist[i][j][1] == 1) {
          continue;
        } else {
          datalist[i][j][1] = 1
          // 剩下的按单个记录保存；
          array1[col1] = [];
          array1[col1][0] = j;
          array1[col1][1] = i
          col1 = col1 + 1;
        }
      }
    }
    pain(cyt, array1, 1, 1, img);
  } else {
    return
  }
}
export default {
  getqrcode,
  changeqrcode
};