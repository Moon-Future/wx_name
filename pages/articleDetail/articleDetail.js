// miniprogram/pages/articleDetail/articleDetail.js
import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    id: '',
    tab: '',
    poetry: {},
    loading: false,
    tabName: 'text',
    tabsFlag: false,
    articleTabs: [
      { title: '赏析', content: '赏析大撒大撒' },
      { title: '评价', content: '评价大师傅' }
    ] // 诗词赏析分 tab 显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { title, id = '', tab = '' } = options
    this.setData({
      tab: tab,
      id: id
    })
    this.getContent(title, id, tab)
  },

  async getContent(title, id, tab) {
    Toast.loading({ message: '加载中...', forbidClick: true, duration: 0})
    try {
      const res = await ajax({
        url: 'getArticleFile',
        data: { title, id, tab }
      })
      let { poetry = {}, article = '' } = res
      article = article.replace(/<img /g, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"')
      if (article.indexOf('《《《《《-----') === -1) {
        this.setData({
          articleTabs: [],
          tabsFlag: false,
          content: article,
          title: title,
          poetry: poetry
        })
      } else {
        let arr = article.match(/《《《《《-----(.*?)-----》》》》》/g)
        let articleTabs = []
        for (let i = arr.length - 1; i >= 0; i--) {
          articleTabs.push({
            title: arr[i].replace('《《《《《-----', '').replace('-----》》》》》', '').trim(),
            content: article.split(arr[i])[1]
          })
          article = article.split(arr[i])[0]
        }
        articleTabs.reverse()
        this.setData({
          articleTabs: articleTabs,
          tabsFlag: true,
          content: '',
          title: title,
          poetry: poetry
        })
      }
      Toast.clear()
    } catch (e) {
      Toast.clear()
    }
  },

  changeTab(e) {
    let name = e.detail.name
    this.setData({
      tabName: name
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