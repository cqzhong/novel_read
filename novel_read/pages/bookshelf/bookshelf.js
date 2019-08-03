// pages/bookshelf/bookshelf.js

const config = require("../../utils/config.js");
import {
  bookUpdate
} from '../../api/bookcase'

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 160,
    isScroll: true,
    bookList: [],
    fn: "goToSelectBook",
    isRefresh: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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

    var that = this;
    wx.getStorage({
      key: config.Bookcase,
      success: function(res) {

        that.setData({
          bookList: res.data
        });

        if (that.data.isRefresh) that.onPullDownRefresh();
      },
    });

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

    if (this.data.bookList.length == 0) return;

    var that = this,
        parametres = "",
        url = "";

    for (let i = 0; i< this.data.bookList.length; i++) {

      let obj = this.data.bookList[i];
      parametres = parametres + obj._id;
      if (i < this.data.bookList.length - 1) {
        parametres = parametres + ",";
      }
    }

    bookUpdate({id: parametres}).then(res => {

      let arr = that.data.bookList;
      for (let i = 0; i < arr.length; i++) {
        let obj1 = arr[i],
          obj2 = res[i];
        obj1.isUpdate = false;
        if (obj1.updated !== obj2.updated) {
          obj1.isUpdate = true;
          obj1.updated = obj2.updated;
        }
        obj1.updateTime = util.getUpdateString(obj1.updated);
        obj1.right = 0;
        obj1.z_index = -1;
      }

      that.setData({
        bookList: arr,
        isRefresh: false
      })
      wx.setStorage({
        key: config.Bookcase,
        data: arr,
      });

      wx.stopPullDownRefresh();

    }).catch(err => {

      wx.stopPullDownRefresh();
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 阅读书籍
   */
  toRead: function (e) {

    var obj = e.currentTarget.dataset.obj;

    var arr = this.data.bookList;
    arr.splice(e.currentTarget.dataset.index, 1);
    arr.unshift(obj);
    
    wx.setStorage({
      key: config.Bookcase,
      data: arr
    });
    wx.navigateTo({
      url: "../read/read?bookId=" + obj._id + "&bookTitle=" + obj.title + "&isUpdate=" + obj.isUpdate,
    });
  },
  /**
   * 查看书籍详情
   */
  checkBookDetail: function (e) {

    var obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: "../bookDetail/bookDetail?bookId=" + obj._id,
    })
  },
  /**
   * 选择书籍
   */
  goToSelectBook: function (e) {

    wx.switchTab({
      url: "../classify/classify",
    })
  },

  //删除操作
  drawStart: function (e) {

    var touch = e.touches[0]

    for (var index in this.data.bookList) {
      var item = this.data.bookList[index]
      item.right = 0
      item.z_index = -1;
    }
    this.setData({
      bookList: this.data.bookList,
      startX: touch.clientX,
    })
  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.bookList[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX;
      // item.z_index = 10;
      this.setData({
        isScroll: false,
        bookList: this.data.bookList
      })
    } else {
      item.right = 0
      item.z_index = -1;
      this.setData({
        isScroll: true,
        bookList: this.data.bookList,
      })
    }
  },
  drawEnd: function (e) {
    var item = this.data.bookList[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth;
      item.z_index = 10;
      this.setData({
        isScroll: true,
        bookList: this.data.bookList,
      })
    } else {
      item.right = 0
      item.z_index = -1;
      this.setData({
        isScroll: true,
        bookList: this.data.bookList
      })
    }
  },

  delItem: function (e) {

    let index = e.currentTarget.dataset.index,
        arr = this.data.bookList;
    
    let obj = arr.indexOf(index);
    arr.splice(index,1);

    this.setData({
      bookList: arr,
    });
    //更新书架
    wx.setStorage({
      key: config.Bookcase,
      data: arr
    });
    //删除目录
    wx.removeStorage({
      key: obj._id + config.BookDirectory,
      success: function(res) {
        console.log("目录删除成功");
      },
    });

    //删除阅读到第几章节
    wx.removeStorage({
      key: obj._id + config.BookLinkNum,
      success: function(res) {
        console.log("num删除成功");
      },
    });

    //删除书籍内容来源
    wx.removeStorage({
      key: obj._id + config.BookCurrentSource,
      success: function(res) {
        console.log("来源删除成功");
      },
    })

  }

})