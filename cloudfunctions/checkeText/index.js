// 云函数入// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');

cloud.init({
  env: 'xier-8gptzwg769125208'
});

// 云函数入口函数
exports.main = async (event, context) => {
  let text = event.txt;
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  const result = await cloud.openapi.security.msgSecCheck({
    "openid": open_id,
    "scene": 1,
    "version": 2,
    "content": text
  })
  return result.result.suggest;
}