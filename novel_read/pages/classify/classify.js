// pages/classify/classify.js

import {
  classifyList
} from '../../api/classify'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    classifyObj: {},
    objAttribute: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.loadClassifyListData();
  },

  /**
   * 请求数据
   */
  loadClassifyListData: function () {

    wx.showLoading({})
    classifyList({}).then(res => {

      let objAttribute = {};
      let tmpMap = new Map([["male", "男生"], ["female", "女生"], ["picture", "漫画"], ["press", "出版"]]);
      for (var x in res) {
        if (x !== "ok") objAttribute[x] = tmpMap.get(x);
      }

      this.setData({
        classifyObj: res,
        objAttribute: objAttribute
      })
      wx.hideLoading()
    }).catch(err => {

      wx.hideLoading()
    })
  },

  //查看分类列表
  checkClassifyList: function (e) {

    var major = e.currentTarget.dataset.major,
      gender = e.currentTarget.dataset.gender;

    wx.navigateTo({
      //classify/classifyList/classifyList
      url: "../classify/classifyList/classifyList?gender=" + gender + "&major=" + major,
    })
  }

})