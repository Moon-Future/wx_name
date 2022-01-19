// const baseUrl = 'http://192.168.8.209:5555/api/wxName/'
const baseUrl = 'https://wxproject.cl8023.com/api/wxName/'
// const baseUrl = 'http://localhost:5555/api/wxName/'

const API = {
  getArticle: baseUrl + 'getArticle',
  getArticleFile: baseUrl + 'getArticleFile',
  createName: baseUrl + 'createName',
  getWxArticle: baseUrl + 'getWxArticle',
  getRandArticle: baseUrl + 'getRandArticle',
  getNameList: baseUrl + 'getNameList',
  getSurnameList: baseUrl + 'getSurnameList',

  getAccessToken: baseUrl + 'getAccessToken'
}

export function http(opts) {
  opts.url = API[opts.url]
  wx.request(opts)
}

export function ajax(opts) {
  const { url, data, method, requestUrl } = opts
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl || API[url],
      data,
      method: method || 'POST',
      success(res) {
        resolve(res.data)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}
