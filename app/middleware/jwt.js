/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-21 16:36:16
 * @LastEditTime: 2021-04-21 17:08:12
 * @FilePath: \teach-research-server\app\middleware\jwt.js
 */
'use strict';

module.exports = options => {
    return async function jwt(ctx, next) {
        const token = ctx.request.header.authorization;
        let decode;
        if (token) {
            try {
                // 解码token
                decode = ctx.app.jwt.verify(token, options.secret);
                ctx.state.user = decode;
                await next();
            } catch (error) {
                console.log(111);
                ctx.status = 401;
                ctx.body = {
                    code: ctx.status,
                    message: error.message,
                };
                return;
            }
        } else {
            ctx.status = 401;
            ctx.body = {
                code: ctx.status,
                message: '没有权限，请先登录',
            };
            return;
        }
    };
};
