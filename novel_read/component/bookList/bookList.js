// component/bookList/bookList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      value:[],
      observer: function () {

      }
    },

    isLoadmore:{
      type: Boolean,
      value: false,
      observer: function () {

      }
    },

    showLoad:{
      type: Boolean,
      value: true
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
    //加载更多
    loadMore: function () {
      console.log("加载更多");
      this.triggerEvent("loadMore")
    },

    //查看书籍详情
    viewBookDetail: function (e) {
      var bookId = e.currentTarget.dataset.id;
      this.triggerEvent("viewBookDetail", {bookId})
    }
  }
})
