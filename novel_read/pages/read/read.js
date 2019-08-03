// pages/read/read.js

const util = require("../../utils/util.js");
const config = require("../../utils/config.js");

import {
  readSource,
  readChapters,
  readChapterContent
} from '../../api/read'


var moveTime = null; //控制左滑右滑的动画
var isMoving = 0;
var leftTimmerCount = 0;
var rightTimmerCount = 0;
var hasRunTouchMove = false;

/**
* 计算总页数函数，需要理解行高---line-height和字体大小font-size之间的关系，可以查考http://www.jianshu.com/p/f1019737e155，以及http://www.w3school.com.cn/cssref/pr_dim_line-height.asp
* @param str 需要分页的内容
* @param fontSize 当前的字体大小
* @param lineHeight 当前的行高
* @param windowW 当前window的宽度
* @param windowH 当前window的高度
* @param pixelRatio 当前分辨率，用来将rpx转换成px
* rpx转px: var px = (rpx / 750) * wx.getSystemInfoSync().windowWidth;
* px转rpx: var rpx = px * (750 / wx.getSystemInfoSync().windowWidth);
*/

function countPageNum(str, fontSize, lineHeight, windowW, windowH, pixelRatio) {

  // windowH += 64;
  console.log("\n fontSize: " + fontSize +"\n lineHeight:" + lineHeight + "\n windowW:" + windowW + "\n windowH:" + windowH + "\n pixelRatio:" + pixelRatio);
  var returnNum = 0;
  fontSize = fontSize;
  lineHeight = lineHeight;
  //将str根据’\n‘截成数组
  var strArray = str.split(/\n+/);
  var splitArray = [];//换行符的个数集合
  var reg = new RegExp('\n+', 'igm');
  var result = '';
  //这里写一个for循环去记录每处分隔符的\n的个数，这将会影响到计算换行的高度
  while ((result = reg.exec(str)) != null) {
    splitArray.push(result.toString().match(/\n/img).length);
  }
  var totalHeight = 0;
  strArray.forEach(function (item, index) {
    var wrapNum = 0;
    //splitArray的长度比strArray小1
    if (splitArray.length < index) {
      wrapNum = splitArray[index] - 1;
    }
    //Math.ceil向上取整
    // totalHeight += Math.ceil(item.length / Math.floor((windowW - 120 / pixelRatio) / fontSize)) * lineHeight + wrapNum * lineHeight;
    // totalHeight += Math.ceil(item.length / Math.floor((windowW * pixelRatio - 120) / fontSize)) * lineHeight + wrapNum * lineHeight;
    totalHeight += (item.length / ((windowW * pixelRatio - 120) / fontSize)) * lineHeight + wrapNum * lineHeight;
  });

  // let num = Math.ceil(totalHeight / (windowH * pixelRatio)) + 1;
  // console.log("totalHeight1: " + totalHeight)
  // totalHeight = totalHeight + (lineHeight + 20) * num
  // console.log("totalHeight2: " + totalHeight)

  return Math.ceil(totalHeight / (windowH * pixelRatio)) + 1;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "",    //书籍ID
    bookTitle: "",
    mapBooksSources: {},
    sourceId: "",    //书籍来源
    isShowFooter: false, 
    isChangeSource: false, //是否更换书源
    isUpdate: false, //是否更换书籍目录
    isChangeDirectory: false, // 是否从章节目录切换了章节。
    bookContentsObj: {}, //书籍目录
    linkNum: 0, //第几章
    style: {
      color: '#000',
      fontSize: 32, //单位rpx
      lineHeight: 52 
    },
    windows: { windowsHeight: 0, windowsWidth: 0, pixelRatio: 3},
    pageNum: 0,
    pageindex: 1,
    leftValue: 0,
    chapterTitle: "", //章节标题
    content: '', //章节内容
    touches: { lastX: 0, lastY: 0 },
    moveDirection: 0, //0代表左滑动，1代表右滑动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var linkNum = wx.getStorageSync(options.bookId + config.BookLinkNum);

    if (linkNum) {
      this.setData({
        linkNum: linkNum
      })
    }
    var that = this;
    wx.setNavigationBarTitle({
      title: options.bookTitle,
    })
    this.setData({
      bookId: options.bookId,
      bookTitle: options.bookTitle,
    });
   

    //获取书籍来源
    wx.getStorage({
      key: options.bookId + config.BookCurrentSource,
      success: function(res) {

        that.setData({
          mapBooksSources: res.data
        })
        if (that.data.bookId in res.data) {

          let sourceId = res.data[that.data.bookId];
          that.setData({
            sourceId:sourceId
          });

          let bookContentsObj = wx.getStorageSync(that.data.bookId + config.BookDirectory);
          if (bookContentsObj) {
            that.setData({
              bookContentsObj: bookContentsObj,
            })

            that.loadChapterContentRequest();
          }

        } else {//没有该书的来源，请求来源，定位来源
          that.loadBookSources();
        }
      },
      fail: function(err) {
        that.loadBookSources();
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    var that = this;
    //获取屏幕的高度和宽度，为分栏做准备
    wx.getSystemInfo({
      success: function (res) {
        let height = res.statusBarHeight + (res.platform === "ios" ? 44 : 48);
        let rule = 750 / res.windowWidth;

        if (rule < res.pixelRatio) {

          console.log("rule的值改变了")
          rule = res.pixelRatio
        }

        console.log("rule: " + rule + "\n height: " + height)
        //分辨率 res.pixelRatio

        console.log("res.windowHeight: " + res.windowHeight)

        that.setData({
          windows: { windowsHeight: res.windowHeight, windowsWidth: res.windowWidth, pixelRatio: rule}
        });

      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (this.data.isChangeSource) {
      console.log("新的源：" + this.data.sourceId);
      this.loadBookSources();
    } 

    if (this.data.isChangeDirectory) { //切换了新的章节

      this.loadChapterContentRequest();
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    this.setData({
      isChangeSource: false,
      isChangeDirectory: false,
      isShowFooter: false
    })
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
   * 关闭阅读
   */
  exitReadPage: function () {

    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 换源
   */
  changeSource: function () {

    wx.navigateTo({

      url: "../read/readSource/readSource?bookId=" + this.data.bookId + "&bookTitle=" + this.data.bookTitle,
    })

  },
  /**
   * 查看目录
   */
  checkTheDirectory: function () {
    wx.navigateTo({

      url: "../read/readDirectory/readDirectory?bookId=" + this.data.bookId + "&linkNum=" + this.data.linkNum + "&bookTitle=" + this.data.bookTitle,
    })
  },
  /**
   * 阅读设置
   */
  showSetup: function () {

  },
  /**
   * 夜间模式
   */
  toNightMode: function () {

  },
  /**
   * 下载
   */
  dowmloadBook: function () {

  },
  /**
   * 获取书籍的源
   */
  loadBookSources: function () {

    readSource({
      book: this.data.bookId
    }).then(res => {

      let sourceId = res[0].link;
      if (res.length > 0) sourceId = res[1]._id;
      
      let mapBooksSources = this.data.mapBooksSources;
      mapBooksSources[this.data.bookId] = sourceId;

      this.setData({
        sourceId: sourceId,
        mapBooksSources: mapBooksSources
      });

      wx.setStorage({
        key: this.data.bookId + config.BookCurrentSource,
        data: mapBooksSources,
      });

      //请求该源下的书籍目录
      this.loadBookContentsRequest();
    })
  },

  /**
   * 获取书籍的目录
   */
  loadBookContentsRequest: function () {
    
    let url = "toc/" + this.data.sourceId
    readChapters(url, {
      view: "chapters",
    }).then(res => {

      this.setData({
        bookContentsObj: res
      })
      wx.setStorage({
        key: this.data.bookId + config.BookDirectory,
        data: res,
      })
      //请求第一章章节内容
      this.loadChapterContentRequest();
    })
  },

  /**
  * 获取章节内容
  */
  loadChapterContentRequest: function () {

    wx.setStorage({
      key: this.data.bookId + config.BookLinkNum,
      data: this.data.linkNum,
    })

    let linkNum = this.data.linkNum,
        bookContentsObj = this.data.bookContentsObj,
        pageindex = 1;

      //bookContentsObj.chapters
    console.log("获取linkNum：" + linkNum + "\n\n获取总章节：\n\n" + bookContentsObj.chapters.length);

    let url = "https://chapter2.zhuishushenqi.com/chapter/" + escape(bookContentsObj.chapters[linkNum].link)

    readChapterContent(url,{
      k: "22870c026d978c75",
      t: "1489933049"
    }).then(res => {

      // if (linkNum < that.data.bookContentsObj.chapters.length - 1) linkNum = Number(linkNum) + 1;
      let content = res.chapter.body.trim();
      content = content.replace("\n\n", "\n");
      // res.chapter.body = content;
      var pageNum = countPageNum(content, this.data.style.fontSize, this.data.style.lineHeight, this.data.windows.windowsWidth, this.data.windows.windowsHeight, this.data.windows.pixelRatio);
      var windth = this.data.windows.windowsWidth;
      var leftValue = windth * (pageindex - 1);

      console.log("获取章节分的数量pages： " + pageNum);
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      this.setData({
        linkNum: linkNum,
        content: content,
        // chapterTitle: res.chapter.title,
        pageNum: pageNum,
        pageindex: pageindex,
        leftValue: -leftValue,
      })

      wx.setStorage({
        key: this.data.bookId + config.BookLinkNum,
        data: linkNum,
      })

    })

  },

  //是否展示设置
  showFooter: function () {
    let isShowFooter = this.data.isShowFooter;
    isShowFooter = !isShowFooter;
    this.setData({
      isShowFooter: isShowFooter
    })
  },

  //上一章
  readBookPreviousChapter: function () {

    let linkNum = this.data.linkNum;
    if (linkNum == 0) {

      wx.showToast({
        icon: 'none',
        title: "已经是第一章了",
      })
      return;
    }

    this.setData({
      linkNum: Number(linkNum) - 1
    })

    this.loadChapterContentRequest();
  },
  //下一章
  readBookNextChapter: function () {

    let linkNum = this.data.linkNum;
    if (linkNum == this.data.bookContentsObj.chapters.length - 1) {

      wx.showToast({
        icon: 'none',
        title: "已经是最后一章了"
      })
      return;
    }

    this.setData({
      linkNum: Number(linkNum) + 1
    })

    this.loadChapterContentRequest();
  },

  handleTouchMove: function (e) {
    if (isMoving == 1) {
      return
    }
    var currentX = e.touches[0].pageX;
    var currentY = e.touches[0].pageY;
    // 判断没有滑动而是点击屏幕的动作
    hasRunTouchMove = true;
    console.log('正在执行touchmove, isMoving为：' + isMoving + '------e: {x: ' + e.touches[0].pageX + ' ,y: ' + e.touches[0].pageY + '}');
    var direction = 0;
    if ((currentX - this.data.touches.lastX) < 0) {
      direction = 0;
    }
    else if ((currentX - this.data.touches.lastX) > 0) {
      direction = 1
    }
    //需要减少或者增加的值
    //将当前坐标进行保存以进行下一次计算
    this.setData({ touches: { lastX: currentX, lastY: currentY }, moveDirection: direction });
  },
  handleTouchStart: function (e) {
    // 判断用户的点击事件，如果不是滑动，将不会执行touchmove
    hasRunTouchMove = false;
    var width = this.data.windows.windowsWidth;
    var direction = 0;
    if (e.touches[0].pageX < (this.data.windows.windowsWidth / 2)) {
      direction = 1
    }
    if (isMoving == 0) {
      this.setData({ touches: { lastX: e.touches[0].pageX, lastY: e.touches[0].pageY }, moveDirection: direction });
    }
  },
  getReadProgress(id) {
    var key = "ReadProgress_" + id;
    var rtn = wx.getStorageSync(key);
    if (rtn == "_undefined") {
      rtn = "1_1";
    }
    return rtn;
  },
  setReadProgress(e) {
    var key = "ReadProgress_" + this.data.id;
    var data = this.data.serialNumber + "_" + this.data.pageindex;
    wx.setStorage({
      key: key,
      data: data
    });
  },
  handleTouchEnd: function () {
    console.log('正在执行touchend, isMoving为：' + isMoving);
    var that = this;
    // 判断用户的点击事件，决定是否显示控制栏
    if (hasRunTouchMove == false) {
      var y = that.data.touches.lastY;
      var x = that.data.touches.lastX;
      var h = that.data.windows.windowsHeight / 2;
      var w = that.data.windows.windowsWidth / 2;
      if (x && y && y >= (h - 50) && y <= (h + 50) && x >= (w - 60) && x <= (w + 60)) {

        console.log("进入点击区域了.......")
        that.showFooter();
        return;
      }
    }
    //左滑动和有滑动的操作
    var currentIndex = that.data.pageindex; //当前页数
    if (isMoving == 0) {
      if (that.data.moveDirection == 0) {
        if (currentIndex < that.data.pageNum) {
          isMoving = 1;
          var windth = that.data.windows.windowsWidth;
          ++currentIndex;
          var leftValue = windth * (currentIndex - 1)
          that.setData({ pageindex: currentIndex, leftValue: -leftValue });
        } else {
       
          that.readBookNextChapter()
          console.log("下一章");
        }
      } else {
        //前一页和后一页相差其实是2个-320px
        if (currentIndex > 1) {
          isMoving = 1;
          var windth = that.data.windows.windowsWidth;
          --currentIndex;
          var leftValue = windth * (currentIndex - 1)
          that.setData({ pageindex: currentIndex, leftValue: -leftValue });
        } else {
          
          that.readBookPreviousChapter()
          console.log("上一章");
        }
      }
      isMoving = 0;
    } else {

    }
  }
})