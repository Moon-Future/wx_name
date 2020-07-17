// miniprogram/pages/createName/createName.js
import { http } from '../../utils/http'
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
      used: '0',
      length: '2',
      feature: '',
    },
    subData: {},
    loading: false,
    loadingMore: false
  },

  onLoad(options) {
    this.setData({
      title: options.title,
      tab: options.tab
    })
    if (options.tab !== '0') {
      this.getName()
    }
  },

  radioChange(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail.value
    this.setData({
      ['formData.' + field]: value
    })
  },

  updateValue(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail.value
    this.setData({
      ['formData.' + field]: value
    })
  },

  // 网游，社交，英文名直接取数据
  getName() {
    http({
      url: 'createName',
      data: { tab: this.data.tab },
      method: 'POST',
      success: (res) => {
        let data = res.data.data
        this.setData({
          nameList: data,
          loadingMore: false,
          count: res.data.count
        })
      },
      fail: () => {

      }
    })
  },

  createName() {
    if (this.data.loading || this.data.loadingMore) {
      return
    }
    let formData = this.data.formData
    formData.exceptList = []
    this.setData({
      loading: true,
      loadingMore: true,
      subData: formData
    })
    http({
      url: 'createName',
      data: formData,
      method: 'POST',
      success: (res) => {
        let data = res.data.data
        this.setData({
          nameList: data,
          loading: false,
          loadingMore: false,
          count: res.data.count
        })
      },
      fail: () => {
        this.setData({
          loading: false,
          loadingMore: false
        })
      }
    })
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