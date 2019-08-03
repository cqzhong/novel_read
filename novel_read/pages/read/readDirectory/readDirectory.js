// pages/read/readDirectory/readDirectory.js

const config = require("../../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    bookId: "",
    bookContentsObj: null,
    linkNum: 0,
    toView: "select0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    this.setData({
      bookId: options.bookId,
      linkNum: options.linkNum,
      // toView: "select"
    })

    wx.setNavigationBarTitle({
      title: options.bookTitle,
    })

    wx.getStorage({
      key: this.data.bookId + config.BookDirectory,
      success: function(res) {

        that.setData({
          bookContentsObj: res.data
        })
      },
    })

    // setTimeout(function () {

    //   console.log("select" + that.data.linkNum.toString());
    //   that.setData({
    //     toView: "select" + that.data.linkNum.toString()
    //   })
    // }, 5000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //
  selectChapter: function (e) {

    let linkNum = e.currentTarget.dataset.index;

    console.log("linknum: " + linkNum)

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      "linkNum": linkNum,
      "isChangeDirectory": true
    })        

    wx.navigateBack({
      delta: 1,
    })  //返回上级页面
  }
})