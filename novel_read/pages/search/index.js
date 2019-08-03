// pages/search/index.js

const util = require("../../utils/util.js");

import {
  hotWord,
  bookSearch
  } from '../../api/search'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    list: [],
    isLoadmore: false,
    showLoad: false,
    page: 0,
    limit: 8,
    isSearch: false,
    hotWordArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadHotwords()
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
   * 热词
   */
  loadHotwords: function () {

    hotWord({}).then(res => {

      let wordLen = (res.hotWords.length > 6) ? 6 : res.hotWords.length;

      this.setData({
        hotWordArray: res.hotWords.slice(0, wordLen)
      });
    })
  
  },
  //键盘搜索按钮点击
  search: function(e) {

    if (this.data.inputVal.length == 0) return;

    this.getListData()
  },
  bindKeyInput(e) {

    this.setData({
      inputVal: e.detail.value
    })

    if (this.data.inputVal.length > 0) return
    this.setData({
      isSearch: false,
      page:0,
      list:[],
      isLoadmore: false
    })
  },
  /**
    * 加载数据
   */
  getListData() {

    wx.showLoading({})
    bookSearch({
      query: this.data.inputVal,
      start: this.data.page,
      limit: this.data.limit
    }).then(res => {

      let page = this.data.page + res.books.length
      let list = this.data.list.concat(res.books)

      let isLoadmore = (res.books.length > 0) ? false : true
      this.setData({
        isLoadmore: isLoadmore,
        list: list,
        showLoad: true,
        page: page,
        isSearch: true
      })
      wx.hideLoading()
    }).catch(err => {

      wx.hideLoading()
    })
  },
  /**
   * 点击热门推荐
   */
  clickHotwords: function(e) {
    
    let word = e.currentTarget.dataset.obj

    this.setData({
      inputVal: word
    })
    
    this.getListData()
  },
  /**
   * 查看详情
   */
  viewBookDetail: function(e) {

    console.log("书籍ID:" + e.detail.bookId);
    let bookId = e.detail.bookId;
    wx.navigateTo({
      url: "../bookDetail/bookDetail?bookId=" + bookId,
    })
  }   

})