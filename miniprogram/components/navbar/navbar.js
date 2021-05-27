// components/navigationbar/navigationbar.js
Component({
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
      title: {
          type: String,
          value: ''
      },
      color: {
          type: String,
          value: '#fff'
      },
      bgColor: {
          type: String,
          value: 'transparent'
      },
      pagefrom:{
        type: String,
        value: 'index'
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      navPadding: 0, // 返回按钮与文本的位置
      navHeight: 0,

  },
  // 胶囊按钮高度获取
  ready() {
      wx.getSystemInfo({
          success: (e) => {
              let info = wx.getMenuButtonBoundingClientRect();
              this.setData({
                  navPadding: info.top, // 返回按钮与文本的位置
                  navHeight: info.height,
              });
          },
      });
      // console.log(this.navBackBgHeight,this.customBarTitleTop,"??")
  },
  /**
   * 组件的方法列表
   */
  methods: {
      goBack() {
            wx.redirectTo({
              url: `/pages/${this.data.pagefrom}/${this.data.pagefrom}`
            })
      }
  },
})