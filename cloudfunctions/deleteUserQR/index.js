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
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  const qr_id = event.qr_id_array;
  const rs = {
    code: 0,
    msg: ''
  };
  if (!qr_id || !qr_id.length) {
    rs.code = -1;
    rs.msg = "未指定qr_id";
    return rs;
  }
  const db_process = await collection_qr_element_list.where({
    _id:_.in(qr_id),
    _open_id:open_id
  });
  const qr_record = await db_process.get();
  if (!qr_record.data || !qr_record.data.length) {
    rs.code = -2;
    rs.msg = "未找到_id对应素材包,有可能已经被删除";
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