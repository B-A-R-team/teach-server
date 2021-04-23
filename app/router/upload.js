/* eslint-disable indent */
'use strict';

module.exports = app => {
    const { router, controller } = app;
    const jwt = app.middleware.jwt(app.config.jwt);
    router.post('/upload/record', controller.upload.index.uploadRecord);
    router.post('/upload/avatar', jwt, controller.upload.index.uploadAvatar);
};
