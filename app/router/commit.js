/*
 * @Author: lts
 * @Date: 2021-04-08 21:42:00
 * @LastEditTime: 2021-04-10 11:19:46
 * @FilePath: \teach-research-server\app\router\commit.js
 */
// eslint-disable-next-line strict
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt(app.config.jwt);
  router.get('/commit/getAllByActive', controller.commit.index.getAllByActive);
  router.post('/commit/createCommit', jwt, controller.commit.index.createCommit);
};
