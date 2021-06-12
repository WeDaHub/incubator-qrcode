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
  const rs = {
    code: 0,
    msg: null
  };
  let {
    limit,
    page_index,
    self,
    order,
    datatype
  } = event;
  let open_id;
  limit += 0;
  page_index += 0;
  if (isNaN(limit) || isNaN(page_index)) {
    rs.code = -1;
    rs.msg = 'limit和page_index参数不正确';
    return rs;
  }
  limit > 20 && (limit = 20);
  let db_process;
  //获取此用户的
  if (self) {
    const wxContext = cloud.getWXContext()
    open_id = wxContext.OPENID;
    db_process = await collection_qr_element_list.where({
      _open_id: open_id
    });
  }
  //获取全部列表
  else {
    if (datatype==0||datatype==undefined) {
      db_process = await collection_qr_element_list;
    }
    if (datatype==1) {
      db_process = await collection_qr_element_list.where({
        publish: true
      });  
    }
    if (datatype==2) {
      db_process = await collection_qr_element_list.where({
        publish: false
      });  
    }
  }

  //排序
  // if (order != 'like') {
  //   db_process = await db_process.orderBy('_like', 'desc');
  // } else {
    db_process = await db_process.orderBy('_upload_time', 'asc');
  // }

  // 先取出集合记录总数
  const countResult = await db_process.count();
  const total = countResult.total;
  const start = page_index * limit;
  return db_process.skip(start).limit(limit).get().then(list => {
    rs.code = 0;
    rs.msg = "success";
    list.data.forEach(item => {
      delete item._open_id;
    });
    rs.data = {
      total: total,
      page_index: page_index,
      limit: limit,
      list: list.data
    };
    return rs;
  }).catch(err => {
    rs.code = -2;
    rs.msg = JSON.stringify(err);
    return rs;
  });
}