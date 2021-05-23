// 云函数入口文件
const cloud = require('wx-server-sdk');
const env = 'xier-8gptzwg769125208';
cloud.init({
  env
});
const db = cloud.database({
  throwOnNotFound: false
});
const collection_qr_element_list = db.collection('QR_Element_LIST');
const url_root = `cloud://${env}`;
const checkPicUrl = function (pic_url) {
  if (typeof pic_url !== 'string') return '';
  if (pic_url.indexOf(url_root) === 0) {
    return pic_url;
  } else {
    return '';
  };
};
const htmlspecialchars = function (str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&#039;');
  return str;
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const open_id = wxContext.OPENID;
  const rs = {
    code: 0,
    msg: ''
  };
  if (!open_id) {
    rs.code = -1;
    rs.msg = "未获取到用户信息";
    return rs;
  }
  let {
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
  if (!element_name) {
    rs.code = -2;
    rs.msg = "未填名称";
    return rs;
  };
  if (!_author_name) {
    rs.code = -2;
    rs.msg = "未填用户名称";
    return rs;
  };
  element_name = htmlspecialchars(element_name);
  _author_name = htmlspecialchars(_author_name);

  if (!checkPicUrl(eye) || !checkPicUrl(one)) {
    rs.code = -2;
    rs.msg = "eye和one格式错误";
    return rs;
  };
  return collection_qr_element_list.add({
    data: {
      _open_id: open_id,
      _like: 0,
      col2:checkPicUrl(col2),
      col3:checkPicUrl(col3),
      col4:checkPicUrl(col4),
      cover:checkPicUrl(cover),
      element_name,
      eye:checkPicUrl(eye),
      one:checkPicUrl(one),
      po7:checkPicUrl(po7),
      re7:checkPicUrl(re7),
      row2:checkPicUrl(row2),
      row3:checkPicUrl(row3),
      row4:checkPicUrl(row4),
      tian:checkPicUrl(tian),
      _author_avatar,
      _author_name
    }
  }).then(add_rs => {
    console.log(add_rs);
    rs.code = 0;
    rs.msg = "上传成功";
    return rs;
  }).catch(add_err => {
    rs.code = -3;
    rs.msg = JSON.stringify(add_err);
    console.error(add_err);
    return rs;
  });
}