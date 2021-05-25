// components/popbox/popbox.js
Component({
  // 启用插槽
  options: {
      multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready(){
      wx.getSystemInfo({
          success: (e) => {
              let info = wx.getMenuButtonBoundingClientRect();
              let height=info.height+info.top*1.5;
              this.setData({
                height:height
              })
          },
      });
  }
})