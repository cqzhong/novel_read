// pages/rank/rankList/rankList.js

import {
  rankDetail
} from '../../../api/rank'


Page({
  /**
   * 页面的初始数据
   */
  data: {
    idField: "",
    isLoadmore: false,
    showLoad: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: options.shortTitle
    })
    this.setData({
      idField: options.idField
    });

    this.loadRankListRequest();
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

  //请求
  loadRankListRequest: function () {
    //https://api.zhuishushenqi.com/ranking/5a6844aafc84c2b8efaa6b6e 

    rankDetail(this.data.idField).then(res => {

      console.log(JSON.stringify(res))

      var list = this.data.list.concat(res.ranking.books);
      this.setData({
        list: list
      })
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