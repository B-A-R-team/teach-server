/* eslint-disable indent */
'use strict';

const { Controller } = require('egg');

class SwiperController extends Controller {
    async index() {
        const { ctx } = this;
        const ret = await ctx.service.swiper.getSwiperData();
        ctx.body = {
            code: 200,
            data: ret,
        };
    }
}

module.exports = SwiperController;
