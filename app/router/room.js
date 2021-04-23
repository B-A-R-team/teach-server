/*
 * @Author: lts
 * @Date: 2021-04-08 18:32:39
 * @LastEditTime: 2021-04-21 18:13:28
 * @FilePath: \teach-research-server\app\router\room.js
 */
// eslint-disable-next-line strict
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt(app.config.jwt);
  router.get('/room/getAll', jwt, controller.room.index.getAllRoom);
  router.post('/room/createRoom', jwt, controller.room.index.createRoom);
  router.put('/room/updateRoom', jwt, controller.room.index.updateRoom);
  router.delete('/room/deleteRoom', jwt, controller.room.index.deleteRoom);
};
