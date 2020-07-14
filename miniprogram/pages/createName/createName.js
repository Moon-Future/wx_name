// miniprogram/pages/createName/createName.js
import { http } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTips: false,
    nameList: [],
    formData: {
      surname: '',
      used: '1',
      length: '1',
      feature: '',
    },
    subData: {},
    loading: false,
    loadingMore: false
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

  createName() {
    if (this.data.loading || this.data.loadingMore) {
      return
    }
    let formData = this.data.formData
    formData.exceptList = []
    console.log(formData)
    // return
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
          loadingMore: false
        })
      },
      fail: () => {

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
          loadingMore: false
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
  }
})