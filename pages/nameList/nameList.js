import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateInfo: null,
    params: null,
    nameList: [],
    nameInfo: []
  },

  onLoad: function (options) {
    this.setData({
      dateInfo: app.globalData.dateInfo,
      params: app.globalData.createNameParams
    })
    this.getNameList()
  },
  

  async getNameList() {
    const { params, dateInfo, nameList } = this.data
    Toast.loading({ message: '加载中...', forbidClick: true, duration: 0})
    try {
      let result = await ajax({
        url: 'createName',
        data: {
          ...params,
          dateInfo
        }
      })
      result.nameInfo = result.nameInfo.split('\n').map(ele => {
        ele = ele.trim()
        if (ele !== '') {
          return ele
        }
      }).filter(ele => ele)
      result.nameList.forEach(ele => {
        let source = ele.source
        if (source) {
          let newSource = ''
          let nameStr = ele.name.split('')
          nameStr.forEach((item, i) => {
            let index = source.indexOf(item)
            if (index !== -1) {
              newSource += source.substr(0, index) + `<span style="color: #00adb5">${item}</span>`
              source = source.substr(index + 1)
              newSource += i === nameStr.length - 1 ? source : ''
            } else {
              newSource += source
            }
          })
          ele.source = newSource
        }
      })
      this.setData({
        nameList: nameList.concat(result.nameList),
        nameInfo: result.nameInfo
      })
      Toast.clear()
    } catch (e) {
      console.log(e)
      Toast.clear()
    }
  },

  readDetail(e) {
    const { title, id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?title=${title}&id=${id}&tab=0`
    })
  },

  copyName(e) {
    const name = e.currentTarget.dataset.name
    wx.setClipboardData({
      data: name
    })
  },

  onReachBottom() {
    this.getNameList()
  },
})