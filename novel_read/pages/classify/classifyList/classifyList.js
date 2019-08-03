// pages/classify/classifyList/classifyList.js

import {
  classifyDetail
} from '../../../api/classify'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gender: "",
    major: "",
    start: 0,
    limit: 10,
    isLoadmore: false,
    showLoad: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("获取参数成功" + options.gender + "\n" + options.major);
    wx.setNavigationBarTitle({
      title: options.major
    })
    this.setData({
      gender: options.gender,
      major: options.major
    });

    this.loadClassifyRequest();
  },

  /**
   * 请求
   * //https://api.zhuishushenqi.com/book/by-categories?gender=male&type=hot&major=玄幻&minor=&start=0&limit=10
   */
  loadClassifyRequest: function () {
    
    wx.showLoading({})
    classifyDetail({
      gender: this.data.gender,
      major: this.data.major,
      type: "hot",
      minor: "",
      start: this.data.start,
      limit: this.data.limit
    }).then(res => {

      let start = res.books.length + this.data.start
      let list = this.data.list.concat(res.books)
      let isLoadmore = res.books.length > 0 ? true : false

      this.setData({
        list: list,
        showLoad: true,
        start: start
      });
      wx.hideLoading()
    }).catch(err => {

      wx.hideLoading()
    })
  },

  //查看详情
  viewBookDetail: function (e) {

    console.log("书籍ID:" + e.detail.bookId);
    let bookId = e.detail.bookId;
    wx.navigateTo({
      url: "../../bookDetail/bookDetail?bookId=" + bookId,
    })
  }
})