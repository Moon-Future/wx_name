import calendar from '../../utils/calendar'
import { formatTime } from '../../utils/util'
import { http } from '../../utils/http'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '宝宝取名',
    tab: '0',
    featurePlaceholder: {
      '0': '古典，霸气，温柔，贤惠...',
      '1': '中二...',
      '2': '霸气...',
      '3': '文艺...'
    },
    topTips: false,
    nameList: [],
    count: 0,
    formData: {
      surname: '',
      gender: '0',
      length: '2',
      feature: '',
      type: '0',
      word: ''
    },
    subData: {},
    loading: false,
    loadingMore: false,

    fieldList: [
      { label: '姓氏', field: 'surname', placeholder: '请输入姓氏', type: 'input' },
      { label: '生辰', field: 'birthday', type: 'datepicker' },
      { label: '性别', field: 'gender', type: 'radio', group: [{ label: '男', name: '1' }, { label: '女', name: '0' }] },
      { label: '字数', field: 'length', type: 'radio', group: [{ label: '单字', name: '1' }, { label: '双字', name: '2' }] },
      { label: '包含', field: 'word', placeholder: '请输入想包含的字', type: 'input' },
      { label: '诗集', field: 'type', type: 'radio', className: 'radio-wrap', group: [{ label: '全部', name: '0' }, { label: '诗经', name: '1', className: 'radio-margin' }, { label: '楚辞', name: '2' }] },
      // { label: '特性', field: 'feature', placeholder: '古典，霸气，温柔，贤惠...', type: 'input' }
    ],
    popupShow: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      } else if (type === 'hour') {
        return `${value}时`
      } else if (type === 'minute') {
        return `${value}分`
      }
      return value
    },
    currentDate: Date.now(),
    currentTime: '',
    dateInfo: null,
    minDate: new Date(1910, 0, 1).getTime(),
    maxDate: new Date(2100, 11, 31).getTime(),
    popupConfig: {}
  },

  onLoad(options) {
    this.setData({
      title: options.title,
      tab: options.tab
    })

    this.birthdayCompute()
  },

  birthdayCompute() {
    const { currentDate } = this.data
    const date = new Date(currentDate)
    const dateInfo = calendar.init(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours())
    dateInfo.wxLack = []
    for (let key in dateInfo.wxMap) {
      if (dateInfo.wxMap[key] === 0) {
        dateInfo.wxLack.push(dateInfo.wxMap2[key])
      }
    }
    dateInfo.wxLackStr = dateInfo.wxLack.join('，')
    this.setData({
      dateInfo,
      currentTime: formatTime(currentDate, 'yyyy年M月d日 h时')
    })
    app.globalData.dateInfo = dateInfo
  },

  changeRadio(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail
    this.setData({
      ['formData.' + field]: value
    })
  },

  changeInput(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail.value
    this.setData({
      ['formData.' + field]: value
    })
  },

  createName() {
    if (this.data.loading || this.data.loadingMore) {
      return
    }
    let formData = this.data.formData
    formData.date = this.data.currentDate
    app.globalData.createNameParams = formData
    wx.navigateTo({
      url: '/pages/nameList/nameList',
    })
    // this.setData({
    //   loading: true,
    //   loadingMore: true,
    //   subData: formData
    // })
    // http({
    //   url: 'createName',
    //   data: formData,
    //   method: 'POST',
    //   success: (res) => {
    //     let data = res.data.data
    //     this.setData({
    //       nameList: data,
    //       loading: false,
    //       loadingMore: false,
    //       count: res.data.count
    //     })
    //   },
    //   fail: () => {
    //     this.setData({
    //       loading: false,
    //       loadingMore: false
    //     })
    //   }
    // })
  },

  openPopup(e) {
    const { type } = e.currentTarget.dataset
    let popupConfig = {}
    if (type === 'datePopup') {
      popupConfig = { type, position: 'bottom', style: 'height:60%;' }
    } else {
      popupConfig = { type, position: 'center', style: 'height:70%;width:80%;border-radius:4px' }
    }
    this.setData({
      popupShow: true,
      popupConfig
    })
  },

  closePopup() {
    this.setData({
      popupShow: false
    })
  },

  confirmDate(e) {
    this.setData({
      popupShow: false,
      currentDate: e.detail
    })
    this.birthdayCompute()
  },

  loadmore() {
    if (this.data.loading || this.data.loadingMore) {
      return
    }
    let subData = this.data.subData
    let nameList = this.data.nameList
    subData.exceptList = nameList.map(ele => {
      return ele.id
    })
    this.setData({
      loadingMore: true
    })
    http({
      url: 'createName',
      data: subData,
      method: 'POST',
      success: (res) => {
        let data = res.data.data
        nameList = nameList.concat(data)
        this.setData({
          nameList: nameList,
          loadingMore: false,
          count: res.data.count
        })
      },
      fail: () => {

      }
    })
  },

  copyName(e) {
    const name = e.currentTarget.dataset.name
    wx.setClipboardData({
      data: name
    })
  },

  clickLike(e) {
    const index = e.currentTarget.dataset.index
    let nameList = this.data.nameList
    let item = nameList[index]
    item.like = !item.like
    nameList.splice(index, 1, item)
    this.setData({
      nameList
    })
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: this.data.nameList[res.target.dataset.index].word + '-取名通',
        path: '/pages/home/home',
      }
    }
    return {
      title: '好名字来自-取名通',
      path: '/pages/home/home',
    }
  }
})