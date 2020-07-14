// miniprogram/pages/home/home.js
import { formatTime } from '../../utils/util'
import { http } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594120161177&di=3222c2511f6325d93fb78db47c4d59ab&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Fback_pic%2F03%2F72%2F40%2F0057b93bca30cb6.jpg' },
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594120210741&di=53f98403647a7aa67644cf89edb102ff&imgtype=0&src=http%3A%2F%2Fphoto.16pic.com%2F00%2F47%2F38%2F16pic_4738284_b.jpg' },
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594120161174&di=78a9f47875876dd7d75603769e859c1a&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fback_pic%2F00%2F00%2F69%2F40%2Fs_1198_2cc8d6389629c39568e4a22b851e2b88.jpg' }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    navList: [
      { icon: 'icon-baobao', txt: '宝宝取名', background: '#e79cc2',
        page: '/pages/createName/createName' },
      { icon: 'icon-shejiaoquan', txt: '社交昵称', background: '#ff9234',
        page: '/pages/createName/createName' },
      { icon: 'icon-game', txt: '游戏昵称', background: '#87dfd6',
        page: '/pages/createName/createName' },
      { icon: 'icon-english', txt: '英文取名', background: '#a3f7bf',
        page: '/pages/createName/createName' }
    ],
    list: [
      { 
        title: '2020鼠宝宝起名大全',
        img: 'https://www.yw11.com/uploads/00_yw11/boy/boy_73.jpg',
        time: '07-07',
        tag: '起名理论'
      }
    ]
  },

  onLoad() {
    this.getArticleList()
  },

  getArticleList() {
    const self = this
    http({
      url: 'getArticle',
      success: function(res) {
        let list = res.data.data
        list.forEach((ele, index) => {
          list[index].date = formatTime(ele.date, 'yyyy-MM-dd')
        })
        self.setData({
          list: list
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
})