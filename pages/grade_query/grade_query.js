// pages/grade_query/grade_query.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tableHeader: [
      {
        prop: 'lesson_name',
        width: 300,
        label: '课程名称',
        color: '#666666'
      },
      {
        prop: 'credit',
        width: 100,
        label: '学分'
      },
      {
        prop: 'grade',
        width: 152,
        label: '成绩'
      },
      {
        prop: 'teacher',
        width: 150,
        label: '授课教师'
      },
    ],
    stripe: true,
    border: true,
    outBorder: true,
    row: [
      {
          "id": 1,
          "lesson_name": "高等数学",
          "credit": '6',
          "grade": '80',
          "teacher": "啦啦啦啦",
      }, {
        "id": 2,
        "lesson_name": "高等数学高等数学高等数学高等数学",
        "credit": '6',
        "grade": '80.888',
        "teacher": "啦啦啦啦",
      }
    ],
    msg: '暂无数据'
  },

  /** 
   * 点击表格一行
   */
  onRowClick: function(e) {
    console.log('e: ', e)
  }
})
