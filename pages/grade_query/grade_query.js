// pages/grade_query/grade_query.js
import Message from '../../tdesign-miniprogram/message/index';
import Dialog from '../../tdesign-miniprogram/dialog/index';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ave_grades: "计算中...",
    if_tips: "",
    if_grade_subscribe: 0,
    if_grade_subscribe_disabaled: true,
    times: 0,
    tableHeader: [
      {
        prop: 'kcmc',
        width: 300,
        label: '课程名称',
      },
      {
        prop: 'kcxf',
        width: 100,
        label: '学分'
      },
      {
        prop: 'cj',
        width: 152,
        label: '成绩'
      },
      {
        prop: 'rkjs',
        width: 150,
        label: '授课教师'
      },
    ],
    stripe: true,
    border: true,
    outBorder: true,
    row: null,
    msg: '暂无数据'
  },
  subscribe:function() {
    const that = this
    wx.login({
      success: function (res) {
        if (res.errMsg === "login:ok") {
          // 获取是否订阅和订阅次数
          wx.request({
            url: 'http://127.0.0.1:6677/api/grade_subscribe_or_add_times_wx',
            data: {
              code: res.code
            },
            method: 'POST',  
            header: {'content-type': 'application/json'},
            success: function(res){
              if (res.statusCode != 200) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: '远端服务器链接错误，请重试',
                });
              }
              else if (res.data.code) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });
              } else {
                // 得到是否订阅状态
                if (res.data.sub_status == true) {
                  that.setData({
                    if_grade_subscribe: 1,
                    if_grade_subscribe_disabaled: false,
                    times: that.data.times+1,
                  })
                }
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
    this.setData({
      times: parseInt(that.data.times) + 1
    })
  },
  unsubscribe:function() {
    const that = this
    wx.login({
      success: function (res) {
        if (res.errMsg === "login:ok") {
          // 获取是否订阅和订阅次数
          wx.request({
            url: 'http://127.0.0.1:6677/api/grade_cancel_subscribe',
            data: {
              code: res.code
            },
            method: 'POST',  
            header: {'content-type': 'application/json'},
            success: function(res){
              if (res.statusCode != 200) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: '远端服务器链接错误，请重试',
                });
              }
              else if (res.data.code) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });
              } else {
                if (res.data == "success") {
                  Message.success({
                    offset: [20, 32],
                    duration: 2000,
                    content: "取消订阅成功",
                  });
                  that.setData({
                    if_grade_subscribe: 0,
                    if_grade_subscribe_disabaled: true,
                  })
                }
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
  no_tips_btn:function() {
    this.setData({if_tips: "None"})
    // 存储本地，记住用户选择
    wx.setStorageSync('if_show_grade_subscribe_tips', "None")
  },
  on_change: function() {
    const that = this
    if (this.data.if_grade_subscribe != 0) {
      this.setData({
        if_grade_subscribe: 1,
        if_grade_subscribe_disabaled: false
      })
    }
    // 如果单选框处于未点击状态，打开弹窗
    else if (this.data.if_grade_subscribe == 0) {
      Dialog.confirm({
        title: "成绩推送声明",
        content: "为了方便用户及时知晓新的成绩，我们将在每一次新成绩发布（包括教师撤回成绩后再次发布）时，推送消息至您的微信。但不会在远端数据库保存您的成绩信息。",
        confirmBtn: "同意",
      })
        .then(() => {
          that.setData({
            if_grade_subscribe: 1,
            if_grade_subscribe_disabaled: false
          })
        })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    this.setData({
      if_tips: wx.getStorageSync('if_show_grade_subscribe_tips'),
      isLoading: true,
    })
    wx.login({
      success: function (res) {
        if (res.errMsg === "login:ok") {
          // 获取是否订阅和订阅次数
          wx.request({
            url: 'http://127.0.0.1:6677/api/if_grade_subscribe_wx',
            data: {
              code: res.code
            },
            method: 'POST',  
            header: {'content-type': 'application/json'},
            success: function(res){
              if (res.statusCode != 200) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: '远端服务器链接错误，请重试',
                });
              }
              else if (res.data.code) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });
              } else {
                // 得到是否订阅状态
                if (res.data.sub_status == true) {
                  that.setData({
                    if_grade_subscribe: 1,
                    if_grade_subscribe_disabaled: false,
                    times: res.data.sub_times,
                  })
                } else {
                  that.setData({
                    if_grade_subscribe: 0,
                    if_grade_subscribe_disabaled: true,
                    times: 0,
                  })
                }
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
    // 获取成绩信息
    wx.login({
      success: function (res) {
        if (res.errMsg === "login:ok") {
          wx.request({
            url: 'http://127.0.0.1:6677/api/wx_auto_login',
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
                that.setData({
                  isLoading: false
                })
              }
              else if (res.data.code) {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });
                that.setData({
                  isLoading: false
                })
              } else {
                // 自动登录成功，开始成绩查询
                wx.login({
                  success: function (res) {
                    // 登录成功
                    if (res.errMsg === "login:ok") {
                      wx.request({
                        url: 'http://127.0.0.1:6677/api/grade_query_once',
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
                            that.setData({
                              isLoading: false
                            })
                          }
                          else if (res.data.code) {
                            Message.error({
                              offset: [20, 32],
                              duration: 2000,
                              content: res.data.message,
                            });
                            that.setData({
                              isLoading: false
                            })
                          } else {
                            console.log(res.data)
                            that.setData({
                              row: res.data,
                              isLoading: false
                            })
                            // 计算平均学分成绩
                            let sum_grade = 0
                            for (let i = 0; i < res.data.length; i++) {
                              sum_grade = sum_grade + parseInt(res.data[i].cj)
                            }
                            let ave_grades = sum_grade / res.data.length
                            ave_grades = Math.round(ave_grades * 1000) / 1000
                            that.setData({ave_grades: ave_grades+""})
                          }
                        }
                      })
                    }
                  }
                })
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
})
