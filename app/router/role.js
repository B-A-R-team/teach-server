/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-10 11:32:49
 * @LastEditTime: 2021-04-21 17:09:46
 * @FilePath: \teach-research-server\app\router\role.js
 */
'use strict';

module.exports = app => {
    const { router, controller } = app;
    const jwt = app.middleware.jwt(app.config.jwt);
    router.post('/role/create', jwt, controller.role.index.create);
    // router.put('/role/update', jwt, controller.role.index.update);
};
