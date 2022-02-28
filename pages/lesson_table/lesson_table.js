// pages/lesson_table/lesson_table.js
import Message from '../../tdesign-miniprogram/message/index';
Page({
  data: {
    mode: 0, // 0代表周模式，1代表星期模式
    term_start_date: "2022/02/21",
    termcode: 44,
    start_year: 2021, term: 2,
    week: 3,
    kcm: null, js: null, jsbh: null, shsj: null,
    pop_visible: false,
    color_list: ["#E57373","#F06292","#BA68C8","#9575CD","#7986CB","#64B5F6","#4FC3F7","#4DD0E1","#4DB6AC","#81C784","#AED581","#DCE775","#FFF176","#FFD54F","#FFB74D","#FF8A65","#A1887F","#E0E0E0","#90A4AE"],
    type: 0,
    currentTab: 1,
    show: false,
    dayTab: 0,
    day: ['10.25', '10.26', '10.27', '10.28', '10.29', '10.30', '10.31',],
    wlist: [],
  },
  pre_week: function() {
    let week = null
    if (this.data.week == 1) {
      return
    } else {
      week = this.data.week - 1
    }
    this.setData({
      week: week,
    })
    wx.setStorageSync('week', week)
  },
  next_week: function() {
    let week = null
    if (this.data.week == 16) {
      return
    } else {
      week = this.data.week + 1
    }
    this.setData({
      week: week,
    })
    wx.setStorageSync('week', week)
  },
  last_term_click: function() {
    let start_year, term = null;
    if (this.data.term == 1) {
      start_year = this.data.start_year - 1
      term = 2
    } else {
      start_year = this.data.start_year
      term = 1
    }
    let termcode = this.data.termcode
    this.setData({
      termcode: termcode - 1,
      start_year: start_year,
      term: term,
    })
    wx.setStorageSync('termcode', termcode - 1)
    wx.setStorageSync('start_year', start_year)
    wx.setStorageSync('term', term)
    this.get_lesson_table()
  },
  next_term_click: function() {
    let start_year, term = null;
    if (this.data.term == 2) {
      start_year = this.data.start_year + 1
      term = 1
    } else {
      start_year = this.data.start_year
      term = 2
    }
    let termcode = this.data.termcode
    this.setData({
      termcode: termcode + 1,
      start_year: start_year,
      term: term,
    })
    wx.setStorageSync('termcode', termcode + 1)
    wx.setStorageSync('start_year', start_year)
    wx.setStorageSync('term', term)
    this.get_lesson_table()
  },
  onVisibleChange({detail}) { 
    this.setData({ 
      pop_visible: detail.visiable
    }); 
  }, 
  showCardView: function(e) {
    let list = e.currentTarget.dataset.wlist
    console.log(e.currentTarget.dataset.wlist)
    this.setData({
      kcm: list.kcm,
      js: list.js,
      jsbh: list.jsbh,
      shsj: list.shsj,
      pop_visible: true,
    })
  },
  getDaysBetween: function(startTime, endTime) {
    //转化日期为时间戳，ios与Android兼容写法
    var  startDate = Date.parse(startTime);
    var  endDate = Date.parse(endTime);
    var days=(endDate - startDate)/(1*24*60*60*1000) + 1;
    var month=days/30;
    var monthDay=days%30;
    var week=days/7;
    var weekDay=days%7;
    // return days+"天";//两个时间间隔的天数
    week = Math.round(parseInt(week))
    if (weekDay > 0) week = week + 1
    return week;//两个时间间隔了几周(向上取整)
    //return Math.round(parseInt(month))+' 月 '+monthDay+' 天';//两个时间间隔了几个月
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
  get_lesson_table: function () {
    const that = this
    let wlist = []
    wx.login({
      success: function (res) {
        // 获取课表
        wx.request({
          url: 'http://127.0.0.1:6677/api/lesson_table_query',
          data: {
            code: res.code,
            termcode: that.data.termcode
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
            } else if (res.data.err_code) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: res.data.err_msg,
              });
            } else {
              console.log(res.data)
              let lesson_map = new Map();
              for (let i = 1; i < res.data.length; i++) {
                for (let j = 1; j <=7; j++) {
                  let z = "z" + j 
                  if (res.data[i][z] == null) continue
                  if (!lesson_map.get(res.data[i][z])) {
                    let time_list = [{"kcm": res.data[i].z1, "xqj": j, "jc": i}]
                    lesson_map.set(res.data[i][z], time_list)
                  } else {
                    let time_list = lesson_map.get(res.data[i][z])
                    time_list.push({"kcm": res.data[i].z1, "xqj": j, "jc": i})
                    lesson_map.set(res.data[i][z], time_list)
                  }
                }
              }
              // 按课程处理信息
              lesson_map.forEach(function(value, key) {
                // <br/>第二外语-日语1班[1-8周] 沈樱[(临港)三教501]
                let kcm = key.split("<br/>")[1].split("[")[0]
                let js = key.split("<br/>")[1].split("]")[1].split("[")[0].trim()
                let jsbh = key.split("<br/>")[1].split("]")[1].split("[")[1].split(")")[1]
                let shsj = key.split("<br/>")[1].split("[")[1].split("]")[0]
                let start_week = parseInt(shsj.split("-")[0])
                let end_week = parseInt(shsj.split("-")[1])
                
                function sort(a,b) {  
                  return a.xqj-b.xqj  
                }
                value.sort(sort);
                let last_xq = -1; let last_jc = -1
                let count = 1
                let lesson = {}
                for (let m = 0; m < value.length; m++) {
                  let item = value[m]
                  // 是连续的统一节课
                  if (item.xqj == last_xq && item.jc == last_jc + 1) {
                    count++
                  // 是不同节课
                  } else {
                    if (count !== 1) {
                      lesson["skcd"] = count
                      wlist.push(lesson)
                    }  
                    count = 1
                    lesson = {"kcm": kcm, "js": js, "jsbh": jsbh, "skjc": item.jc, "xqj": item.xqj, "shsj": shsj, "start_week": start_week, "end_week": end_week}
                  }
                  last_jc = item.jc; last_xq = item.xqj
                }
                lesson["skcd"] = count
                wlist.push(lesson)
              })
              function my_indexOf(list, item_key) {  
                for (let i = 0; i < list.length; i++) {
                  if (item_key === list[i].kcm) return i
                }
                return -1
              }
              for (let i = 0; i < wlist.length; i++) {
                let index = my_indexOf(wlist, wlist[i].kcm)
                wlist[i].color = that.data.color_list[index]
              }
              that.setData({wlist: wlist})
              console.log(wlist)
            }
          }
        })
      }
    })
  },
  onShow: function () {
    const that = this
    // 计算当前是第几周
    var myDate = new Date();
    const curr_date = myDate.toLocaleDateString(); 
    let delt = this.getDaysBetween(that.data.term_start_date, curr_date)
    wx.setStorageSync('week', delt)

    // 获取学期序号
    let termcode = wx.getStorageSync('termcode')
    let start_year  = wx.getStorageSync('start_year')
    let term  = wx.getStorageSync('term')
    let week  = wx.getStorageSync('week')
    this.setData({
      termcode: termcode,
      start_year: start_year,
      term: term,
      week: week,
    })
    if (!termcode) {
      this.setData({termcode: 44})
    }
    if (!start_year) {
      this.setData({start_year: 2021})
    }
    if (!term) {
      this.setData({term: 2})
    }
    if (!week) {
      this.setData({week: 1})
    }
    // 获取课表
    that.get_lesson_table()
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