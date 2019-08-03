// pages/bookDetail/authorBooks/authorBooks.js

import {
  author
} from '../../../api/bookDetail'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    author: "",
    bookList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: options.author + "的全部书籍",
    });
    this.setData({
      author: options.author
    });

    this.loadAuthorBooks();
  },
  
  /**
   * 请求
   */
  loadAuthorBooks: function () {

    author({
      author: this.data.author
      }).then(res => {

        this.setData({
          bookList: res.books
        });
    })
  },

  /**
   * 查看详情
   */
  viewBookDetail: function (e) {

    let bookId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../bookDetail/bookDetail?bookId=" + bookId,
    })
  }
})