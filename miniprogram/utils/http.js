const baseUrl = 'http://localhost:5555/api/proname/'

const API = {
  getArticle: baseUrl + 'getArticle',
  getArticleFile: baseUrl + 'getArticleFile',
  createName: baseUrl + 'createName'
}

export function http(opts) {
  opts.url = API[opts.url]
  wx.request(opts)
}