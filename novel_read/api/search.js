const request = require('./request.js')
export const hotWord = (params) => request.get('https://api09ecx7.zhuishushenqi.com/book/hot-word', params)
export const bookSearch = (params) => request.get('book/fuzzy-search', params)

