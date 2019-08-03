//排行榜
const request = require('./request.js')
export const readSource = (params) => request.get('atoc?view=summary', params)
export const readChapters = (url,params) => request.get(url, params)
export const readChapterContent = (url,params) => request.get(url, params)
