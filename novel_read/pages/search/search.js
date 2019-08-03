// pages/search/search.js

const util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    list: [],
    page: 0,
    limit: 7,
    key: '',
    inputShowed: false,
    inputVal: "",
    hasnext: true,
    isLoadmore: false,
    showLoad: false,
    hotWordArray:[],
    colorArray: ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
      "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
      "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
      "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
      "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"],
    randomColorArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadHotwords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    
  },
   /**
    * 热词
   */
  loadHotwords: function () {

    util.appendURLGetRequest(
      "https://api09ecx7.zhuishushenqi.com/book/hot-word",
      res => {

        var that = this,
            labLen = that.data.colorArray.length,
            colorArr = that.data.colorArray,
            array = [],
            wordLen = (res.hotWords.length > 10) ? 10 : res.hotWords.length;
        do{
          let random = colorArr[Math.floor(Math.random() * colorArr.length)];
          array.push(random);
        } while (array.length < wordLen)
        
        that.setData({
          randomColorArray: array,
          hotWordArray: res.hotWords.slice(0, wordLen)
        });
      },
      err => {
      }
    );
  },
  /**
    * 加载数据
   */
  getListData() {

    var that = this;
    let url = "book/fuzzy-search?query=" + this.data.inputVal + "&start=" + this.data.page + "&limit=" + this.data.limit;
    util.commonLoadingRequest(
      url,
      res => {
        var page = res.books.length + 1;
        var list = that.data.list.concat(res.books);
        that.setData({
          list : list,
          showLoad: true,
          page: page
        });
      },
      err => {
      }
    );
  },
  //点击热搜关键词
  clickHotwords: function (e) {
    console.log(e.currentTarget.dataset.keyword);
    let words = e.currentTarget.dataset.keyword;
    this.setData({
      inputVal: words,
      list: [],
      inputShowed: true
    });
    this.getListData();
  },
  /**
   * 键盘响应
   */
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    // this.getListData();
  },
  clickSearchEvent: function (e) {

    this.setData({
      page: 0,
      list: [],
      inputShowed: false,
      showLoad: false
    });
    this.getListData();
  },
  /**
   * 搜索响应
   */
  showInput: function (e) {
    this.setData({
      inputShowed: true
    });
  },
  /**
   * 清理输入文字
   */
  clearInput: function (e) {
    this.setData({
      inputVal: ""
    });
  },
   /**
   * 取消搜索
   */
  hideInput: function(e) {
    this.setData({
      inputVal: "",
      list:[],
      inputShowed:false,
      showLoad: false
    });
  },

  //查看详情
  viewBookDetail: function(e) {

    console.log("书籍ID:" + e.detail.bookId);
    let bookId = e.detail.bookId;
    wx.navigateTo({
      url: "../bookDetail/bookDetail?bookId=" + bookId,
    })
  }
})