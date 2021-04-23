/*
 * @Author: lts
 * @Date: 2021-04-10 11:32:53
 * @LastEditTime: 2021-04-11 10:29:58
 * @FilePath: \teach-research-server\app\service\role.js
 */
/* eslint-disable indent */
'use strict';

const { Service } = require('egg');

class RoleService extends Service {
    async create(params) {
        const { name, role_menu, value } = params;
        const { role_id } = this.ctx.state.user;
        if (role_id > 3) {
            const ret = await this.app.mysql.insert('role', {
                name,
                role_menu,
                value,
            });
            if (ret.affectedRows === 1) {
                return {
                    id: ret.insertId,
                    ...params,
                };
            }
            return {
                msg: '添加失败',
            };
        }
        return {
            msg: '权限不足',
        };
    }

}
module.exports = RoleService;
