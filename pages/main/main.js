// pages/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_tab_index: 0,
    list: [
      {"name": "study", "text": "学业管理", "icon": "chart"},
      {"name": "info", "text": "公告", "icon": "chat"},
      {"name": "personal", "text": "学生事务", "icon": "app"},
    ],
    functions:[
      [
        {"title": "成绩查询", "description": "提供成绩查询以及订阅服务", "icon": "chart-bar", 
         "if-note": false, "note": ""},
         {"title": "课程教学评价（学评教）", "description": "提供与研究生系统同步的评教服务", "icon": "books", 
         "if-note": true, "note": "敬请期待"},
      ],
      [],
      [
        {"title": "学生动态申请", "description": "提供与研究生系统同步的请假服务", "icon": "chart-bubble", 
        "if-note": true, "note": "敬请期待"},
         {"title": "学生请假申请", "description": "提供与研究生系统同步的请假服务", "icon": "chart-pie", 
         "if-note": true, "note": "敬请期待"},
      ],
    ]
  },

  switch_tab(e) {
    console.log(e.detail)
    this.setData({current_tab_index: e.detail})
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

  }
})