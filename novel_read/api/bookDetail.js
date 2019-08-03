const request = require('./request.js')
export const detail = (params) => request.get('book/', params)
export const author = (params) => request.get('https://api02u58f.zhuishushenqi.com/book/accurate-search', params)
