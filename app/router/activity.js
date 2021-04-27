/*
 * @Author: lts
 * @Date: 2021-03-31 09:21:22
 * @LastEditTime: 2021-04-21 16:42:51
 * @FilePath: \teach-research-server\app\router\activity.js
 */
// eslint-disable-next-line strict
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt(app.config.jwt);
  router.get('/active/getAllActivities', controller.activity.index.getAllActivities);
  router.get('/active/getActives', controller.activity.index.getActivesByType);
  router.get('/active/getActiveById/', controller.activity.index.getActiveById);
  router.get('/active/perActive/', jwt, controller.activity.index.getPersonActives);
  router.get('/active/advance', jwt, controller.activity.index.getAdvanceByUserId);
  router.get('/active/getActivesByTime', controller.activity.index.getActivesByDay);
  router.post('/active/createActive', jwt, controller.activity.index.createActive);
  router.post('/active/issueAdvance', jwt, controller.activity.index.issueAdvance);
  router.delete('/active/deleteActiveById', jwt, controller.activity.index.deleteActiveById);
  router.put('/active/updateActiveById', jwt, controller.activity.index.updateActiveById);
  router.put('/active/agreeActive', jwt, controller.activity.index.agreeActive);
};
