import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameList: [],
    count: null,
    pageNo: 1,
    visible: false,
    nameObj: {},
    top: 0
  },

  onLoad() {
    this.getNameList()
  },

  async getNameList() {
    const { count, nameList, pageNo } = this.data
    if (count && nameList.length >= count) {
      return
    }
    Toast.loading({ message: '加载中...', forbidClick: true, duration: 0})
    try {
      const result = await ajax({
        url: 'getNameList',
        data: {
          pageNo: pageNo
        }
      })
      result.data.forEach(ele => {
        let source = ele.source
        if (source) {
          let newSource = ''
          let wordStr = ele.word.split('')
          wordStr.forEach((item, i) => {
            let index = source.indexOf(item)
            if (index !== -1) {
              newSource += source.substr(0, index) + `<span style="color: #00adb5">${item}</span>`
              source = source.substr(index + 1)
              newSource += i === wordStr.length - 1 ? source : ''
            } else {
              newSource += source
            }
          })
          ele.source = newSource
        }
        ele.sourceText = `${ele.source} --${ele.author}${ele.dynasty === '' ? '' : '·' }${ele.dynasty } ${ele.poetry === '' ? '' : '《' + ele.poetry + '》' }`
      })
      this.setData({
        nameList: nameList.concat(result.data)
      })
      this.data.count = result.count
      this.data.pageNo = pageNo + 1
      Toast.clear()
    } catch (e) {
      Toast.clear()
    }
  },

  clickItem(e) {
    const { index } = e.currentTarget.dataset
    let selQuery = wx.createSelectorQuery()
    selQuery.select('.name-list').boundingClientRect(res => {
      this.setData({
        visible: true,
        nameObj: this.data.nameList[index],
        top: res.top
      })
    }).exec()
  },

  onClose() {
    this.setData({
      visible: false
    })
    wx.pageScrollTo({
      scrollTop: -this.data.top,
      duration: 0
    })
  },

  onReachBottom(e) {
    this.getNameList()
  },
})