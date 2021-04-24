/*
 * @Author: lts
 * @Date: 2021-03-30 17:44:34
 * @LastEditTime: 2021-04-10 11:33:12
 * @FilePath: \teach-research-server\app\router.js
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/user')(app);
  require('./router/activity')(app);
  require('./router/room')(app);
  require('./router/commit')(app);
  require('./router/role')(app);
  require('./router/upload')(app);
  require('./router/swiper')(app);
};
