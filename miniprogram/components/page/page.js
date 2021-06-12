// components/page/page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageid: {
      type: Number,
      value: 0
    },
    pagenum: {
      type: Number,
      value: 0
    }
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
    prepage() {
      this.triggerEvent('prepage', false);
    },
    nextpage() {
      this.triggerEvent('nextpage', false);
    },
  }
})