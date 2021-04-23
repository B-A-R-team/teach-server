/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-08 21:41:44
 * @LastEditTime: 2021-04-10 11:20:49
 * @FilePath: \teach-research-server\app\controller\commit\index.js
 */
'use strict';
const { Controller } = require('egg');

class CommitController extends Controller {
    async getAllByActive() {
        const { ctx } = this;
        const { id } = ctx.query;
        const ret = await ctx.service.commit.getAllByActive(id);
        ctx.body = {
            code: 200,
            data: ret,
        };
    }
    async createCommit() {
        const { ctx } = this;
        const params = ctx.request.body;
        const ret = await ctx.service.commit.createCommit(params);
        ctx.body = {
            code: 200,
            data: ret,
        };
    }
}

module.exports = CommitController;
