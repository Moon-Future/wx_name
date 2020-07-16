// miniprogram/pages/articleDetail/articleDetail.js
import { http } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    tab: '',
    poetry: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { title, id = '', tab = '' } = options
    this.setData({
      tab: tab
    })
    this.getContent(title, id, tab)
  },

  getContent(title, id, tab) {
    this.setData({
      loading: true
    })
    http({
      url: 'getArticleFile',
      data: { title, id, tab },
      success: (res) => {
        let { poetry, article } = res.data
        this.setData({
          loading: false,
          title: title,
          poetry: poetry,
          content: article.replace(/<img /g, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"') 
        })
      },
      fail: () => {
        this.setData({
          loading: false
        })
      }
    })
  },

  onShareAppMessage(res) {
    const { title, id, tab } = this.data
    return {
      title: `${title}-取名通`,
      path: `/pages/articleDetail/articleDetail?title=${title}&id=${id}&tab=${tab}`,
    }
  }
})