// components/navigationbar/navigationbar.js
Component({
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的初始数据
   */
  data: {
      navHeight: 0,
  },
  // 胶囊按钮高度获取
  ready() {
      wx.getSystemInfo({
          success: (e) => {
              let info = wx.getMenuButtonBoundingClientRect();
              this.setData({
                  navHeight: info.height,
              });
          },
      });
  }
})