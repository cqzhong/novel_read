// pages/rank/rank.js

import {
  rankList
} from '../../api/rank'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rankObj: {},
    maleArray: [],
    maleMoreArray: [],
    femaleArray: [],
    femaleMoreArray: [],
    isMaleExpand: false,
    isFemaleExpand: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadRankListRequest();

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
   * 获取排行榜
   * 追书最热榜：https://api.zhuishushenqi.com/ranking/54d42d92321052167dfb75e3
   * https://api.zhuishushenqi.com/ranking/gender
   */
  loadRankListRequest: function () {

    rankList({}).then(res => {
    
      var maleArray = [],
        maleMoreArray = [],
        femaleArray = [],
        femaleMoreArray = [];

      for (var x of res.male) {
        if (x.collapse == false) 
          maleArray.push(x)
         else 
          maleMoreArray.push(x)
      }

      for (var x of res.female) {
        if (x.collapse == false) 
          femaleArray.push(x)
         else 
          femaleMoreArray.push(x)
      }

      this.setData({
        rankObj: res,
        maleArray: maleArray,
        maleMoreArray: maleMoreArray,
        femaleArray: femaleArray,
        femaleMoreArray: femaleMoreArray
      })

    })
    
  },
  //展开排行榜
  expandedRank: function (e) {

    let isMaleExpand = false,
        isFemaleExpand = false;
    if (e.currentTarget.dataset.type === "male") {
      isMaleExpand = !this.data.isMaleExpand;
      isFemaleExpand = this.data.isFemaleExpand;
    } else {
      isMaleExpand = this.data.isMaleExpand;
      isFemaleExpand = !this.data.isFemaleExpand;
    }

    this.setData({
      isMaleExpand: isMaleExpand,
      isFemaleExpand: isFemaleExpand
    });
  },
  //查看榜单详情
  checkRankList: function (e) {

    wx.navigateTo({
      url: "../rank/rankList/rankList?idField=" + e.currentTarget.dataset.obj._id + "&shortTitle=" + e.currentTarget.dataset.obj.shortTitle,
    })
  }
})