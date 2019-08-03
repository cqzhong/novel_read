//分类
const request = require('./request.js')
export const classifyList = (params) => request.get('cats/lv2/statistics', params)
export const classifyDetail = (params) => request.get('book/by-categories', params)
