import { http, ajax } from '../../utils/http'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateInfo: null,
    params: null
  },

  onLoad: function (options) {
    this.setData({
      dateInfo: app.globalData.dateInfo,
      params: app.globalData.createNameParams
    })
    console.log(app.globalData, this.data)
    this.getName()
  },
  

  async getName() {
    const { params } = this.data
    await ajax({
      url: 'createName',
      data: params
    })
  }
})