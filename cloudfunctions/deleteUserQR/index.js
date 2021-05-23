// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xier-8gptzwg769125208'
});

//获取数据库引用
const db = cloud.database({
  throwOnNotFound: false
});
const collection_qr_element_list = db.collection('QR_Element_LIST');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  const qr_id = event.qr_id;
  const rs = {
    code: 0,
    msg: ''
  };
  if (!qr_id) {
    rs.code = -1;
    rs.msg = "未指定qr_id";
    return rs;
  }
  const db_process = await collection_qr_element_list.doc(qr_id);
  const qr_record = await db_process.get();
  if (!qr_record.data) {
    rs.code = -2;
    rs.msg = "未找到此素材包,有可能已经被删除";
    return rs;
  }
  if(qr_record.data._open_id !== open_id){
    rs.code = -3;
    rs.msg = "无法确认身份";
    return rs;
  }
  return db_process.remove().then(() => {
    rs.code = 0;
    rs.msg = "删除成功";
    return rs;
  }).catch(err => {
    rs.code = -3;
    rs.msg = JSON.stringify(err);
    return rs;
  });
}