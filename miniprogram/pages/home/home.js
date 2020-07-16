// miniprogram/pages/home/home.js
import { formatTime } from '../../utils/util'
import { http } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [
      { img: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_name/banner/banner-1.png' },
      { img: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_name/banner/banner-2.png' },
      { img: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_name/banner/banner-3.png' }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    navList: [
      { icon: 'icon-baobao', txt: '宝宝取名', background: '#e79cc2',
        page: '/pages/createName/createName?title=宝宝取名&tab=0' },
      { icon: 'icon-shejiaoquan', txt: '社交昵称', background: '#ff9234',
        page: '/pages/createName/createName?title=社交昵称&tab=1' },
      { icon: 'icon-game', txt: '游戏昵称', background: '#87dfd6',
        page: '/pages/createName/createName?title=游戏昵称&tab=2' },
      { icon: 'icon-english', txt: '英文取名', background: '#a3f7bf',
        page: '/pages/createName/createName?title=英文取名&tab=3' }
    ],
    list: []
  },

  onLoad() {
    this.getArticleList()
  },

  getArticleList() {
    this.setData({
      loading: true
    })
    http({
      url: 'getRandArticle',
      success: (res) => {
        let list = res.data.data
        list.forEach((ele, index) => {
          list[index].date = formatTime(ele.date, 'yyyy-MM-dd')
        })
        this.setData({
          list: list,
          loading: false
        })
      },
      fail: () => {
        this.setData({
          loading: false
        })
      }
    })
  },

  goPage(e) {
    const page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: page
    })
  },

  moreArticle() {
    wx.switchTab({
      url: '/pages/article/article'
    })
  },

  onShareAppMessage: function() {
    return {
      title: '转发',
      path: '/pages/home/home',
    }
  }
})