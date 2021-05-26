// components/navigationbar/navigationbar.js
Component({
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的初始数据
   */
  data: {
      height: 0,
  },
  // 胶囊按钮高度获取
  ready() {
    wx.getSystemInfo({
        success: (e) => {
            let info = wx.getMenuButtonBoundingClientRect();
            this.setData({
                height: (1.5*info.top)+info.height, // 返回按钮与文本的位置
            });
        },
    });
  }
})