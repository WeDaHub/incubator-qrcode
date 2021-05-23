// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'xier-8gptzwg769125208'
});
//获取数据库引用
const db = cloud.database({
  throwOnNotFound: false
});
const collection_qr_element_list = db.collection('QR_Element_LIST');
const collection_like_record = db.collection('QRLikeRecord');

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
  };
  if (!open_id) {
    rs.code = -1;
    rs.msg = "未获取到用户信息";
    return rs;
  }
  const stage_time = Date.now() / 60000 >> 0;

  //查询数据库此用户该时间段已上传次数
  let like_db_process = await collection_like_record.where({
    open_id: open_id
  });
  let _id;
  let user_record = await like_db_process.get();
  user_record = user_record.data[0];
  if (user_record) {
    _id = user_record._id;
  } else {
    _id = await collection_like_record.add({
      data: {
        stage_time: stage_time,
        stage_sum: 0,
        open_id
      }
    }).then(rs => rs._id).catch(err => null);
    user_record = await like_db_process.get();
    user_record = user_record.data[0];
  }
  let stage_sum;
  if (user_record.stage_time === stage_time) {
    stage_sum = user_record.stage_sum;
  } else {
    user_record.stage_time = stage_time;
    stage_sum = 0;
  }
  if (stage_sum > 30) {
    rs.code = -2;
    rs.msg = "已超出点赞次数,请稍后再试";
    return rs;
  }
  ++stage_sum;
  collection_like_record.doc(_id).update({
    data: {
      stage_sum,
      stage_time
    }
  });

  const qr_db_process = await collection_qr_element_list.doc(qr_id);
  const qr_record = await qr_db_process.get();
  if (!qr_record.data) {
    rs.code = -3;
    rs.msg = "未找到此素材包,有可能已经被删除";
    return rs;
  }
  qr_like_sum = qr_record.data._like;
  ++qr_like_sum;
  return qr_db_process.update({data:{
    _like:qr_like_sum
  }}).then(()=>{
    rs.code = 0;
    rs.msg = '点赞成功';
    rs._id = _id;
    rs.like = qr_like_sum;
    return rs;
  }).catch(err=>{
    rs.code = -4;
    rs.msg = JSON.stringify(err);
    return rs;
  });
}