/* eslint-disable indent */
'use strict';

module.exports = app => {
    const { router, controller } = app;
    const jwt = app.middleware.jwt(app.config.jwt);
    router.post('/role/create', jwt, controller.role.index.create);
    router.put('/role/update', jwt, controller.role.index.updateRole);
    router.get('/role', jwt, controller.role.index.getAllRoles);
};
