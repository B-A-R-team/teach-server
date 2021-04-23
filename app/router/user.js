/*
 * @Author: lts
 * @Date: 2021-03-31 09:21:22
 * @LastEditTime: 2021-04-21 17:09:38
 * @FilePath: \teach-research-server\app\router\user.js
 */
// eslint-disable-next-line strict
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt(app.config.jwt);
  router.get('/user/getAllUsers', jwt, controller.user.index.getAllUsers);
  router.post('/user/register', controller.user.index.register);
  router.post('/user/login', controller.user.index.login);
  router.get('/user/getUserById', controller.user.index.getUserById);
  router.get('/user/getUsersByRoomId', jwt, controller.user.index.getUsersByRoomId);
};
