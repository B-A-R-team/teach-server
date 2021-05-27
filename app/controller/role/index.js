/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-11 09:42:46
 * @LastEditTime: 2021-04-11 09:49:18
 * @FilePath: \teach-research-server\app\controller\role\role.js
 */
'use strict';

const { Controller } = require('egg');

class RoleController extends Controller {
    async create() {
        const { ctx } = this;
        const params = ctx.request.body;
        const ret = await ctx.service.role.create(params);
        ctx.body = {
            code: 200,
            data: ret,
        };
    }
    async getAllRoles() {
        const { ctx } = this;
        const ret = await ctx.service.role.getAllRoles();
        ctx.body = {
            code: 200,
            data: ret,
        };
    }
    async updateRole() {
        const { ctx } = this;
        const params = ctx.request.body;
        const ret = await ctx.service.role.updateRole(params);
        ctx.body = {
            code: 200,
            data: ret,
        };
    }
}
module.exports = RoleController;
