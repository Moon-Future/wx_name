// miniprogram/pages/article/article.js
import { http } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContent(options.title)
  },

  getContent(title) {
    http({
      url: 'getArticleFile',
      data: {
        title: title
      },
      success: (res) => {
        let content = res.data.data
        this.setData({
          title: title,
          content: content.replace(/<img /g, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"') 
        })
      }
    })
  }
})