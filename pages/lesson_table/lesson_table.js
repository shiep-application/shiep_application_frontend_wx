// pages/lesson_table/lesson_table.js
Page({
  data: {
    type: 0,
    currentTab: 1,
    show: false,
    dayTab: 0,
    weekList: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    day: ['10.25', '10.26', '10.27', '10.28', '10.29', '10.30', '10.31',],
    wlist: [
      { "xqj": 4, "skjc": 2, "skcd": 3, "kcm": "高等数学", "jsbh": "A308", "color": 1 },
      { "xqj": 1, "skjc": 1, "skcd": 2, "kcm": "高等数学", "jsbh": "A308", "color": 0 },
    ],
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
        })
      },
    })
  },

  clickShow: function (e) {
    var that = this;
    that.setData({
      show: !that.data.show,
    })
  },

  clickHide: function (e) {
    var that = this
    that.setData({
      show: false
    })
  },

  swichNav: function (e) {
    this.clickHide();
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current,
      })
    }
  },

  stopTouchMove: function () {
    return false;
  },

  dayCheck: function (e) {
    var that = this;
    if (that.data.dayTab === e.currentTarget.dataset.daytab) {
      return false;
    } else {
      that.setData({
        dayTab: e.currentTarget.dataset.daytab,
      })
    }
  },

  swiperChange: function (e) {
    var self = this
    self.setData({
      dayTab: e.detail.current,
    })
  },

  showCardView: function (e) {
    let cardView = {
      kcm: e.currentTarget.dataset.wlist.kcm,
      color: e.currentTarget.dataset.wlist.color,
      jsbh: e.currentTarget.dataset.wlist.jsbh,
    }
    this.setData({
      cardView: cardView
    })
    this.util("open");
  },

  hideModal() {
    this.util("close");
  },

  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 100, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation
      })

      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
})