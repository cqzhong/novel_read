/*
 * 1、const定义的变量不可以修改，而且必须初始化。
 * 2、var定义的变量可以修改，如果不初始化会输出undefined，不会报错。
 * 3、let是块级作用域，函数内部使用let定义后，对函数外部无影响。
 * 4、箭头函数，如果参数不是一个，就需要用括号()括起来
 * 5、如果参数是一个对象 要({ foo: x })写，因为和函数体的{ ... }有语法冲突
 */

import config from '../utils/config'

const request = ({
  url = '',
  param = {},
  ...other
} = {}) => {

  return new Promise((resolve, reject) => {

    wx.request({
      url: getUrl(url),
      data: param,
      ...other,
      header: {

      },
      success: res => {

        resolve(res.data);
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = config.kRequestURLBase + url;
  }
  return url
}

//RequestMethod

const get = (url, param = {}) => {

  if (typeof param !== 'object') {
    url = url + param
    param = {}
  }
  return request({
    url,
    param,
    method: 'get'
  })
}

const post = (url, param = {}) => {

  return request({
    url,
    param,
    method: 'post'
  })
}


module.exports = {
  get,
  post
}
