/* eslint-disable indent */
'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.get('/swiper', controller.swiper.index.index);
};
