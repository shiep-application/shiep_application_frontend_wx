// pages/bound/bound.js
import Dialog from '../../tdesign-miniprogram/dialog/index';
import Message from '../../tdesign-miniprogram/message/index';
const url_prefix = "https://shiep.xuyuyan.cn"
// const url_prefix = "http://127.0.0.1:6677"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio1: 0,
    isdiabaled: true,
    username: null,
    password: null,
  },
  set_username: function(e) {
    this.setData({"username": e.detail.value})
  },
  set_password: function(e) {
    this.setData({"password": e.detail.value})
  },
  bound_cancel: function() {
    console.log(1)
    const that = this
    // 获取wx_code
    wx.login({
      success: function (res) {
        wx.request({
          url: url_prefix + '/api/cancel_bound_user',
          data: {
            code: res.code,
          },
          method: 'POST',  
          header: {'content-type': 'application/json'},
          success: function(res){
            // 非200请求
            if (res.statusCode != 200) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: '远端服务器链接错误，请重试',
              });
            }
            // 微信开放平台后台错误
            if (res.data.code === 10001) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: res.data.message,
              });
            } else {
              if (res.data.status === "success") {
                Message.success({
                  offset: [20, 32],
                  duration: 2000,
                  content: '解绑成功',
                });
                wx.setStorageSync('bound_user', 0)
                that.setData({
                  radio1: 0,
                  isdiabaled: true
                })
              } else {
                Message.error({
                  offset: [20, 32],
                  duration: 2000,
                  content: res.data.message,
                });  
              }
            }
          }
        })
      }
    })
  },
  bound: function(){
    const that = this
    // 获取wx_code
    wx.login({
      success: function (res) {
        // code转open_id
        wx.request({
          url: url_prefix + '/api/code2openid',
          data: {
            code: res.code,
          },
          method: 'POST',  
          header: {'content-type': 'application/json'},
          success: function(res){
            // 非200请求
            if (res.statusCode != 200) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: '远端服务器链接错误，请重试',
              });
            }
            // 微信开放平台后台错误
            if (res.data.code === 10001) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: res.data.message,
              });
            } else {
              // 绑定用户
              wx.request({
                url: url_prefix + '/api/bound_user',
                data: {
                  username: that.data.username,
                  password: that.data.password,
                  session_key: res.data.session_key,
                  open_id: res.data.open_id
                },
                method: 'POST',  
                header: {'content-type': 'application/json'},
                success: function(res){
                  console.log(res)
                  // 非200请求
                  if (res.statusCode != 200) {
                    Message.error({
                      offset: [20, 32],
                      duration: 2000,
                      content: '远端服务器链接错误，请重试',
                    });
                  }
                  if (res.data.status === "success") {
                    Message.success({
                      offset: [20, 32],
                      duration: 2000,
                      content: '绑定成功',
                    });
                    wx.setStorageSync('bound_user', 1)
                    that.setData({
                      radio1: 1,
                      isdiabaled: false,
                    })
                    wx.redirectTo({
                      url: '../main/main',
                    })
                  } else {
                    Message.error({
                      offset: [20, 32],
                      duration: 2000,
                      content: res.data.message,
                    });  
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  on_change: function(){
    const that = this
    if (this.data.radio1 != 0) {
      this.setData({
        radio1: 0,
        isdiabaled: true
      })
    }
    // 如果单选框处于未点击状态，打开弹窗
    else if (this.data.radio1 == 0) {
      Dialog.confirm({
        title: "绑定声明",
        content: "绑定即将您的研究生系统账号和密码与您的微信账户绑定，为使后续课无登录感知地使用本软件，我们将不可避免地存储您的账号和密码。我们将对您的个人信息进行严格保密，软件已在 https://github.com/shiep-application 开源，开发者自愿接受公众的监督。",
        confirmBtn: "同意",
      })
        .then(() => {
          this.setData({
            radio1: 1,
            isdiabaled: false
          })
        })
    }
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
    const that = this
    // 获取本地存储的登陆状态
    let bound_user = wx.getStorageSync('bound_user')
    if (! bound_user) {
      this.setData({
        radio1: 0,
        isdiabaled: true,
      })
      wx.setStorageSync('bound_user', 0)
    } else if (bound_user == 1) {
      this.setData({
        radio1: 1,
        isdiabaled: false,
      })
    } else {
      this.setData({
        radio1: 0,
        isdiabaled: true,
      })
    }    

    // 获取wx_code
    wx.login({
      success: function (res) {
        // 查看用户是否绑定
        wx.request({
          url: url_prefix + '/api/check_bound',
          data: {
            code: res.code,
          },
          method: 'POST',  
          header: {'content-type': 'application/json'},
          success: function(res){
            console.log(res.data)
            // 非200请求
            if (res.statusCode != 200) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: '远端服务器链接错误，请重试',
              });
            }
            // 微信开放平台后台错误
            if (res.data.code === 10001) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: res.data.message,
              });
            } else {
              if (res.data === true) {
                that.setData({
                  radio1: 1,
                  isdiabaled: false,
                })
                wx.setStorageSync('bound_user', 1)
              } else {
                that.setData({
                  radio1: 0,
                  isdiabaled: true,
                })
                wx.setStorageSync('bound_user', 0)
              }
            }
          }
        })
      }
    })
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