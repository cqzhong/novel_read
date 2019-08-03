// pages/read/readSource/readSource.js

const util = require("../../../utils/util.js");
const config = require("../../../utils/config.js");

import {
  readSource,
  readChapters,
  readChapterContent
} from '../../../api/read'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "",    //书籍ID
    bookTitle: "",
    linkObj: {}, //书架书籍的来源
    sources: [],
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.setNavigationBarTitle({
      title: options.bookTitle,
    })
    this.setData({
      bookId: options.bookId,
      bookTitle: options.bookTitle
    });

    wx.getStorage({
      key: options.bookId + config.BookCurrentSource,
      success: function(res) {

        that.setData({
          linkObj: res.data,
        })
      },
    })
    this.loadBookSources();
  },


  /**
    * 获取书籍的源
   */
  loadBookSources: function () {

    readSource({
      book: this.data.bookId
    }).then(res => {

      let currentIndex = 0,
        sourceId = this.data.linkObj[this.data.bookId];
      for (let i = 0; i < res.length; i++) {
        let obj = res[i]
        obj.updateTime = util.getUpdateString(obj.updated)
        if (obj._id === sourceId) currentIndex = i
      }

      this.setData({
        sources: res,
        currentIndex: currentIndex
      })

    })
   
  },

  //更换来源
  selectBookSource: function (e) {

    let obj = e.currentTarget.dataset.obj;
    let linkObj = this.data.linkObj;
    linkObj[this.data.bookId] = obj._id;
    wx.setStorage({
      key: config.BookCurrentSource,
      data: linkObj
    });

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      "sourceId": obj._id,
      "isChangeSource" : true
    })        //给上级页面的变量赋值
    wx.navigateBack({
      delta: 1,
    })  //返回上级页面
  }
})