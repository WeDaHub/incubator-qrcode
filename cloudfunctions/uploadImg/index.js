// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs');
const path = require('path');

cloud.init({
  env: 'xier-8gptzwg769125208'
});
const db = cloud.database({
  throwOnNotFound: false
});
const collection_img_record = db.collection('ImgUploadRecord');

// 云函数入口函数
exports.main = async (event, context) => {
  const rs = {
    code: 0,
    msg: ''
  };
  const file_data = event.file_data;
  if (!file_data) {
    rs.code = -1;
    rs.msg = "未传入base64图片"
    return rs;
  }
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  if (!open_id) {
    rs.code = -2;
    rs.msg = "未获取到用户信息"
    return rs;
  }
  const stage_time = Date.now() / 60000 >> 0;

  //查询数据库此用户该时间段已上传次数
  let db_process = await collection_img_record.where({
    open_id:open_id
  }); 
  let _id;
  let user_record = await db_process.get();
  user_record = user_record.data[0];
  if(user_record){
    _id = user_record._id;
  }else{
    _id =  await collection_img_record.add({
      data:{
        stage_time:stage_time,
        stage_sum:0,
        open_id
      }
    }).then(rs=>rs._id).catch(err=>null);
    user_record = await db_process.get();
    user_record = user_record.data[0];
  }
  let stage_sum;
  if(user_record.stage_time === stage_time){
    stage_sum = user_record.stage_sum;
  }else{
    user_record.stage_time = stage_time;
    stage_sum = 0;
  }
  ++stage_sum;
  const file_path = `user_upload_qr_element/${open_id}_${stage_time}_${stage_sum}_${Math.random() * 10000000 >> 0}`;
  return await cloud.uploadFile({
    cloudPath: file_path,
    fileContent: new Buffer(file_data, 'base64')
  }).then(up_rs=>{
    return collection_img_record.doc(_id).update({data:{
      stage_sum,
      stage_time
    }}).then(()=>{
      rs.code = 0;
      rs.msg = "上传成功";
      rs.fileID = up_rs.fileID;
      return rs;
    });
  }).catch(err=>{
    rs.code = -4;
    rs.msg = JSON.stringify(err)
    return rs;
  });
}