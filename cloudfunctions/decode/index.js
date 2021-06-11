// 云函数入// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');

cloud.init({
  env: 'xier-8gptzwg769125208'
});

// 云函数入口函数
exports.main = async (event, context) => {
  let token = await getWechatAccessToken();
  const fileid = event.fileid;
  let img = await getimg(token.access_token, fileid);
  let qrtext=await scanqrcode(img,token);
  return qrtext.code_results;
}

// 获取公众号access_token
async function getWechatAccessToken() {
  let appid = 'wxdb5a9d708acf35ee'; //微信公众号开发者id
  let secret = '731ce47411ac051989925ed55854c528'; //微信公众号开发者secret_key
  let token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  let rp = options =>
    new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  let result = await rp({
    url: token_url,
    method: 'GET'
  });
  return (typeof result.body === 'object') ? result.body : JSON.parse(result.body);
}

async function scanqrcode(imgurl, token) {
  let token_url = `https://api.weixin.qq.com/cv/img/qrcode?img_url=${imgurl}&access_token=${token.access_token}`;
  let rp1 = options =>
    new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  let result = await rp1({
    url: token_url,
    method: 'POST'
  });
  var res=JSON.parse(result.body)
  return res
}

async function getimg(token, fileid) {
  var fileid=fileid;
  let token_url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${token}`;
    var data={
      "env": "xier-8gptzwg769125208",
      "file_list": [{
        "fileid": fileid,
        "max_age": 7200
      }]
    };
  let rp2 = options =>
    new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  let result2 = await rp2({
    url: token_url,
    body:JSON.stringify(data),
    method: 'POST'
  });
  var res=JSON.parse(result2.body)
  return res.file_list[0].download_url;
}