import calendar from '../../utils/calendar'
import { formatTime, checkContent } from '../../utils/util'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      surname: '',
      gender: '0',
      length: '2',
      feature: '',
      type: '0',
      word: '',
    },
    fieldList: [
      { label: '姓氏', field: 'surname', placeholder: '请输入姓氏', type: 'input' },
      { label: '生辰', field: 'birthday', type: 'datepicker' },
      { label: '性别', field: 'gender', type: 'radio', group: [{ label: '男', name: '1' }, { label: '女', name: '0' }] },
      { label: '字数', field: 'length', type: 'radio', group: [{ label: '单字', name: '1' }, { label: '双字', name: '2' }] },
      // { label: '包含', field: 'word', placeholder: '请输入想包含的字', type: 'input' },
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
    popupConfig: {},
    calendarType: '1' // 1：阳历，2：农历
  },

  onLoad(options) {
    this.birthdayCompute()
  },

  birthdayCompute() {
    const { currentDate, calendarType } = this.data
    const date = new Date(currentDate)
    const dateInfo = calendar.init(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), calendarType == '1' ? false : true)
    dateInfo.wxLack = []
    for (let key in dateInfo.wxMap) {
      if (dateInfo.wxMap[key] === 0) {
        dateInfo.wxLack.push(dateInfo.wxMap2[key])
      }
    }
    dateInfo.wxLackStr = dateInfo.wxLack.join('，')
    this.setData({
      dateInfo,
      currentTime: formatTime(currentDate, 'yyyy年MM月dd日 hh时')
    })
    app.globalData.dateInfo = dateInfo
  },

  async changeRadio(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail
    this.setData({
      ['formData.' + field]: value
    })
  },

  changeCalendarType(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail
    this.setData({
      [field]: value
    })
    this.birthdayCompute()
  },

  async changeInput(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail.value
    const checkFlag = await checkContent(value)
    if (!checkFlag) {
      wx.showToast({ title: '含有违规文字', icon: 'none' })
      this.setData({
        ['formData.' + field]: ''
      })
      return
    }
    this.setData({
      ['formData.' + field]: value
    })
  },

  createName() {
    let formData = this.data.formData
    if (formData.surname === '') {
      Toast('请输入姓氏')
      return
    }
    formData.date = this.data.currentDate
    app.globalData.createNameParams = formData
    wx.navigateTo({
      url: '/pages/nameList/nameList',
    })
  },

  openPopup(e) {
    const { type } = e.currentTarget.dataset
    let popupConfig = {}
    if (type === 'datePopup') {
      popupConfig = { type, position: 'bottom', style: 'height:60%;' }
    } else {
      popupConfig = { type, position: 'center', style: 'width:80%;border-radius:4px' }
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

  copyName(e) {
    const name = e.currentTarget.dataset.name
    wx.setClipboardData({
      data: name
    })
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: this.data.nameList[res.target.dataset.index].word + '-取名通',
        path: '/pages/createName/createName',
      }
    }
    return {
      title: '好名字来自-取名通',
      path: '/pages/createName/createName',
    }
  }
})