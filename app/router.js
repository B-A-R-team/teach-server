/*
 * @Author: lts
 * @Date: 2021-03-30 17:44:34
 * @LastEditTime: 2021-03-31 11:25:48
 * @FilePath: \teach-research-server\app\router.js
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/user')(app);
};
