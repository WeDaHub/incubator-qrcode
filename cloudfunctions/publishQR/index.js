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

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  const qr_id = event.qr_id;
  const publish=event.publish;
  var ifadmin = false;
  if (open_id == "oTeIY4x2XbUh-zDPgz11RdynsOTs") {
    ifadmin = true;
  }
  if (ifadmin) {
    collection_qr_element_list .doc(qr_id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        publish: publish
      },
      success: function(res) {
        return "yyds"
      }
    })
  }
}