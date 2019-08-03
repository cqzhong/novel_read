// pages/bookDetail/bookDetail.js
const config = require("../../utils/config.js");

import {
  detail
} from '../../api/bookDetail'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookId:"",
    detailObj:{},
    wordCount:"",
    isContain: false,
    bookList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("成功获取书籍id: " + options.bookId);
    this.setData({
      bookId: options.bookId
    });
    this.loadBookDetailData();
  },
   /**
   * 请求数据
   */
  loadBookDetailData: function () {

    detail(this.data.bookId).then(res => {

      let wordCount = 0
      if (res.wordCount > 10000) 
        wordCount = parseInt(res.wordCount / 10000) + "万字";
       else if (res.wordCount > 1000) 
        wordCount = parseInt(res.wordCount / 1000) + "千字";
       else 
        wordCount = res.wordCount + "字";
      
      this.setData({
        detailObj: res,
        wordCount: wordCount
      })
      this.checkBookshelfContain();
    })

  },

  /**
   * 加入书架
   */
  addABookcase: function (e) {

    if (!this.data.detailObj._id) return;

    this.addABookcaseCommon();

    wx.showToast({
      title: '加入书架成功',
      icon: 'success'
    });
  },

  /**
   * 移除书架
   */
  removeABookcase: function (e) {

    if (!this.data.detailObj._id) return;
    
    let arr = this.data.bookList;
    for (let i = 0; i < arr.length; i++) {

      let obj = arr[i];
      if (obj._id === this.data.bookId) {

        arr.splice(i,1);
        break;
      }
    }

    this.setData({
      isContain: false,
      bookList: arr
    })
    //更新书架
    wx.setStorage({
      key: config.Bookcase,
      data: arr
    });
    //删除目录
    wx.removeStorage({
      key: this.data.bookId + config.BookDirectory,
      success: function (res) {
        console.log("目录删除成功");
      },
    });

    //删除阅读到第几章节
    wx.removeStorage({
      key: this.data.bookId + config.BookLinkNum,
      success: function (res) {
        console.log("num删除成功");
      },
    });

    //删除书籍内容来源
    wx.removeStorage({
      key: this.data.bookId + config.BookCurrentSource,
      success: function (res) {
        console.log("来源删除成功");
      },
    })

    wx.showToast({
      title: '移除书架成功',
      icon: 'success'
    });
  },
  /**
   * 立即阅读
   */
  readingImmediately: function (e) {

    if (!this.data.detailObj._id) return;

    this.addABookcaseCommon();
    var obj = this.data.detailObj;
    wx.navigateTo({
      url: "../read/read?bookId=" + obj._id + "&bookTitle=" + obj.title + "&isUpdate=" + true,
    });
  },
   /**
   * 放入书架
   */
  addABookcaseCommon: function () {

    if (!this.data.detailObj._id) return;

    var that = this;
    wx.getStorage({
      key: config.Bookcase,
      success: function (res) {
        var arr = res.data,
          isContains = false,
          idx = 0;

        for (let i = 0; i < res.data.length; i++) {

          if (res.data[i]._id == that.data.detailObj._id) {
            isContains = true;
            idx = i;
            break;
          }
        }
        if (!isContains && that.data.detailObj._id.length > 0) {
          arr.unshift(that.data.detailObj);
        } else {

          arr.splice(idx, 1);
          arr.unshift(that.data.detailObj);
        }

        that.setData({
          isContain: true,
          bookList: arr
        })
        wx.setStorage({
          key: config.Bookcase,
          data: arr,
        });
      },
      fail: function (res) {

        if (that.data.detailObj._id == 0) return;

        var arr = [that.data.detailObj];
        wx.setStorage({
          key: config.Bookcase,
          data: arr,
        });
      }
    });
  },
   /**
   * 作者的其它书籍
   */
  checkAuthorBooks: function () {

    wx.navigateTo({
        url: "../bookDetail/authorBooks/authorBooks?author=" + this.data.detailObj.author,
    })
  },

  /**
   * 查看书架是否存在该书
   */
  checkBookshelfContain: function () {

    var that = this;
    wx.getStorage({
      key: config.Bookcase,
      success: function (res) {

        let isContain = false;
        for (let obj of res.data) {

          if (obj._id === that.data.detailObj._id) {

            isContain = true;
            break;
          }
        }

        that.setData({
          bookList: res.data,
          isContain: isContain
        });
      },
    });
  }
})