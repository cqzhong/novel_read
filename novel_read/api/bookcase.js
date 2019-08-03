//书架
const request = require('./request.js')
export const bookUpdate = (params) => request.get('book?view=updated', params)
