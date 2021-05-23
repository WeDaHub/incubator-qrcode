// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const {
    col2,
    col3,
    col4,
    cover,
    element_name,
    eye,
    one,
    po7,
    re7,
    row2,
    row3,
    row4,
    tian,
    _author_avatar,
    _author_name
  } = event;

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}