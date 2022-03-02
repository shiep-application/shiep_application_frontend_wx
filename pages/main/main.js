// pages/main.js
import Message from '../../tdesign-miniprogram/message/index';
const url_prefix = "https://shiep.xuyuyan.cn"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_tab_index: 0,
    value: "0",
    list: [
      {"name": "study", "text": "学业管理", "icon": "chart"},
      {"name": "info", "text": "公告", "icon": "chat"},
      {"name": "personal", "text": "学生事务", "icon": "app"},
    ],
    functions:[
      [
        {"title": "绑定学号信息", "description": "将微信账号与学号信息绑定", "icon": "user", 
         "if-note": false, "note": ""},
        {"title": "成绩查询", "description": "提供成绩查询以及订阅服务", "icon": "search", 
         "if-note": false, "note": ""},
         {"title": "课表查询", "description": "提供当学期课表查询服务", "icon": "format-horizontal-align-bottom", 
         "if-note": true, "note": ""},
         {"title": "课程教学评价（学评教）", "description": "提供与研究生系统同步的评教服务", "icon": "thumb-up", 
         "if-note": true, "note": "后端已完成"},
      ],
      [],
      [
        {"title": "学生动态申请", "description": "与研究生系统一致的动态申请服务", "icon": "chart-bubble", 
        "if-note": true, "note": "后端已完成"},
         {"title": "学生请假申请", "description": "与研究生系统一致的请假服务", "icon": "chart-pie", 
         "if-note": true, "note": "敬请期待"},
      ],
    ]
  },
  onTabsChange(e) {
    this.setData({ value: e.detail.value })
  },
  switch_tab(e) {
    // console.log(e.detail)
    this.setData({current_tab_index: e.detail})
  },
  jumpto_function(e){
    console.log(this.data.current_tab_index)    // 哪一页
    console.log(e.currentTarget.dataset.index)  // 当页第几个
    const current_tab_index = this.data.current_tab_index
    const index = e.currentTarget.dataset.index

    // 进入用户绑定界面
    if (current_tab_index == 0 && index == 0) {
      wx.navigateTo({
        url: '../bound/bound'
      })
    }
    // 进入成绩查询界面
    if (current_tab_index == 0 && index == 1) {
      wx.navigateTo({
        url: '../grade_query/grade_query'
      })
    }
    // 进入课表查询界面
    if (current_tab_index == 0 && index == 2) {
      wx.navigateTo({
        url: '../lesson_table/lesson_table'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录
    wx.login({
      success: function (res) {
        // 登录成功
        if (res.errMsg === "login:ok") {
          wx.request({
            url: url_prefix + '/api/wx_auto_login',
            data: {
              code: res.code
            },
            method: 'POST',  
            header: {'content-type': 'application/json'},
            success: function(res){
              console.log(res)
              if (res.statusCode != 200) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: '远端服务器链接错误，请重试',
                });
              }
              else if (res.data.code === 20001) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });
              } else if (res.data.code === 10001) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });
              } else {
                Message.success({
                  offset: [20, 32],
                  duration: 2000,
                  content: '自动登录成功',
                });
              }
            }
          })
        } else {
        // 登录失败
          Message.error({
            offset: [20, 32],
            duration: 2000,
            content: '本地信息获取失败',
          });
        }
      }
    })
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