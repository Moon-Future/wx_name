// const baseUrl = 'http://localhost:5555/api/proname/'
const baseUrl = 'https://wxproject.cl8023.com/api/proname/'

const API = {
  getArticle: baseUrl + 'getArticle',
  getArticleFile: baseUrl + 'getArticleFile',
  createName: baseUrl + 'createName',
  getWxArticle: baseUrl + 'getWxArticle',
  getRandArticle: baseUrl + 'getRandArticle'
}

export function http(opts) {
  opts.url = API[opts.url]
  wx.request(opts)
}