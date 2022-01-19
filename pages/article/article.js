// miniprogram/pages/article/article.js
import { ajax } from '../../utils/http'
import { checkContent } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: [],
    value: '',
    condition: '',
    options: [
      { text: '古诗文', value: 0 },
      { text: '姓氏起源', value: 1 },
      { text: '有趣文章', value: 2 },
    ],
    tab: 0,
    loading: false,
    pageNo: 1,
    pageSize: 20,
    count: '',
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getArticle()
  },

  async getArticle() {
    let { pageNo, pageSize, articleList, count, tab, condition } = this.data
    if (count !== '' && articleList.length >= count) {
      return
    }
    this.setData({
      loading: true,
      noData: false
    })
    try {
      const res = await ajax({
        url: 'getWxArticle',
        data: { pageNo, pageSize, tab, condition }
      })
      let data = res.data
      let count = res.count
      articleList = articleList.concat(data)
      this.setData({
        articleList: articleList,
        loading: false,
        count: count,
        pageNo: pageNo + 1
      })
      if (pageNo === 1 && articleList.length === 0) {
        this.setData({
          noData: true
        })
      }
    } catch (e) {
      this.setData({
        loading: false
      })
    }
    
  },

  onReachBottom() {
    this.getArticle()
  },

  changeTab({ detail }) {
    this.setData({
      tab: detail,
      pageNo: 1,
      articleList: [],
      count: ''
    })
    this.getArticle()
  },

  onChange({ detail }) {
    this.setData({
      value: detail
    })
  },

  async onBlur(e) {
    this.checking = true
    const checkFlag = await checkContent(e.detail.value)
    if (!checkFlag) {
      wx.showToast({ title: '含有违规文字', icon: 'none' })
      this.setData({
        value: ''
      })
      return
    }
    this.checking = false
    if (this.searching) {
      this.search()
    }
  },

  search(e) {
    this.searching = true
    if (this.checking) return
    this.setData({
      pageNo: 1,
      articleList: [],
      condition: this.data.value,
      count: ''
    })
    this.searching = false
    this.getArticle()
  },

  readDetail(e) {
    const index = e.currentTarget.dataset.index
    const data = this.data.articleList[index]
    wx.navigateTo({
      url: `/pages/articleDetail/articleDetail?title=${data.title}&id=${data.id}&tab=${this.data.tab}`
    })
  },

  onShareAppMessage(res) {
    return {
      title: '好名字来自-取名通',
      path: '/pages/article/article',
    }
  }
})