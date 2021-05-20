// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xier-8gptzwg769125208'
});

//获取数据库引用
const db = wx.cloud.database();
const collection_qr_element_list = db.collection('QR_Element_LIST');

// 云函数入口函数
exports.main = async (event, context) => {
  const rs = {
    code: 0,
    msg: null
  };
  let {
    userInfo,
    limit,
    page_index
  } = event;
  limit += 0;
  page_index += 0;
  if (isNaN(limit) || isNaN(page_index)) {
    rs.code = -1;
    rs.msg = 'limit和page_index参数不正确';
    return rs;
  }

  // 先取出集合记录总数
  const countResult = await collection_qr_element_list.count();
  const total = countResult.total;
  const start = page_index * limit;
  return collection_qr_element_list.where({
    upload_time: _.exists(true)
  }).skip(start).limit(limit).get().then(list=>{
    rs.code = 0;
    rs.msg = "success";
    rs.data = {
      total:total,
      page_index:page_index,
      limit:limit,
      list:list
    };
    return rs;
  }).catch(err=>{
    rs.code = -2;
    rs.msg = JSON.stringify(err);
    return rs;
  });
}