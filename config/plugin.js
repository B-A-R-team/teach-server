/*
 * @Author: lts
 * @Date: 2021-03-30 17:44:34
 * @LastEditTime: 2021-04-01 17:32:13
 * @FilePath: \teach-research-server\config\plugin.js
 */
'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
