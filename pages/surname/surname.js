import { ajax } from '../../utils/http'
import { formatTime, checkContent } from '../../utils/util'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    count: '',
    pageNo: 1,
    pageSize: 20,
    value: '',
    condition: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()
  },

  async getDataList() {
    const { count, dataList, pageNo, pageSize, condition } = this.data
    if (count && dataList.length >= count) {
      return
    }
    Toast.loading({ message: '加载中...', forbidClick: true, duration: 0})
    try {
      const result = await ajax({
        url: 'getSurnameList',
        data: {
          pageNo,
          pageSize,
          condition
        }
      })
      result.data.forEach((ele) => {
        ele.date = formatTime(ele.date, 'yyyy-MM-dd')
      })
      this.setData({
        dataList: dataList.concat(result.data)
      })
      this.data.count = result.count
      this.data.pageNo = pageNo + 1
      Toast.clear()
    } catch (e) {
      Toast.clear()
    }
  },

  onReachBottom() {
    this.getDataList()
  },

  onChange({ detail }) {
    console.log('xxxxxxx')
    this.setData({
      value: detail
    })
  },

  async onBlur(e) {
    this.checking = true
    const checkFlag = await checkContent(e.detail.value)
    if (!checkFlag) {
      wx.showToast({ title: '含有违规文字', icon: 'none' })
      this.setData({
        value: ''
      })
      return
    }
    this.checking = false
    if (this.searching) {
      this.search()
    }
  },

  search() {
    this.searching = true
    if (this.checking) return
    this.setData({
      pageNo: 1,
      dataList: [],
      condition: this.data.value,
      count: ''
    })
    this.searching = false
    this.getDataList()
  },

  onShareAppMessage(res) {
    return {
      title: '好名字来自-取名通',
      path: '/pages/surname/surname',
    }
  }
})