// pages/lesson_table/lesson_table.js
import Message from '../../tdesign-miniprogram/message/index';
Page({
  data: {
    kcm: null, js: null, jsbh: null,
    pop_visible: false,
    // color_list: ["#bbd3fb", "#f8b9be", "#f7c797", "#85dbbe", "#eeeeee", "#85daff", "#d8abff", "#fbca25", "#ffb2f2", "#266fe8", "#c9353f", "#ba431b", "#067945", "#007edf", "#834ec2", "#a37200", "#d42c9d"],
    color_list: ["#E57373","#F06292","#BA68C8","#9575CD","#7986CB","#64B5F6","#4FC3F7","#4DD0E1","#4DB6AC","#81C784","#AED581","#DCE775","#FFF176","#FFD54F","#FFB74D","#FF8A65","#A1887F","#E0E0E0","#90A4AE"],
    type: 0,
    currentTab: 1,
    show: false,
    dayTab: 0,
    day: ['10.25', '10.26', '10.27', '10.28', '10.29', '10.30', '10.31',],
    wlist: [],
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
      pop_visible: true
    })
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
  onShow: function () {
    const that = this
    let wlist = []
    // 获取wx_code
    wx.login({
      success: function (res) {
        // 获取课表
        wx.request({
          url: 'http://127.0.0.1:6677/api/lesson_table_query',
          data: {
            code: res.code,
            termcode: 43
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
            } else if (res.data.code) {
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: res.data.message,
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
                    lesson = {"kcm": kcm, "js": js, "jsbh": jsbh, "skjc": item.jc, "xqj": item.xqj}
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
            }
          }
        })
      }
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