//排行榜
const request = require('./request.js')
export const rankList = (params) => request.get('ranking/gender', params)
export const rankDetail = (params) => request.get('ranking/', params)
