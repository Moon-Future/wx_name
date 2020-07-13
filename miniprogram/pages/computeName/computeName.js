// miniprogram/pages/computeName/computeName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTips: false,
    nameList: []
  },

  createName() {
    this.setData({
      nameList: [
        { name: '陈亮', like: false },
        { name: '陈亮1', like: false },
        { name: '陈亮2', like: false },
        { name: '陈亮3', like: false },
        { name: '陈亮4', like: false },
        { name: '陈亮5', like: false },
        { name: '陈亮6', like: false },
        { name: '陈亮7', like: false }
      ]
    })
    wx.cloud.callFunction({
      name: 'createName',
      data: {},
      success: res => {
        wx.showToast({
          title: '调用成功 😰',
        })
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '出了点小状况, 请稍后再试 😰',
        })
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