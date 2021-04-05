/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-03-31 16:40:39
 * @LastEditTime: 2021-04-05 18:55:11
 * @FilePath: \teach-research-server\app\service\user.js
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async findAll() {
        const sql = 'select * from user';
        const users = await this.app.mysql.query(sql);
        return users;
    }
    async register(info) {
        const { username, password, job_id, phone } = info;
        const ret = await this.app.mysql.insert('user',
            {
                name: username,
                password,
                job_id,
                phone,
            });
        return {
            data: ret,
        };
    }
    async login(loginInfo) {
        const { job_id, password } = loginInfo;
        const ret = await this.app.mysql.select('user', {
            where: { job_id, password },
            columns: [ 'name', 'job_id', 'phone', 'avatar', 'role_id', 'id' ],
            limit: 0, // 返回数据量
        });
        // const ret = await this.app.mysql.get('user', {
        //     id: 1,
        // });
        return ret[0];
    }
    async findOneById(id) {
        const ret = await this.app.mysql.get('user', { id });
        console.log(ret);
        return ret;
    }
    async findUsersByRoomId(id) {
        const { ctx, app } = this;
        const { role_id } = ctx.state.user;
        // const ret = await this.app.mysql.select('user', {
        //     where: {
        //         room_id: id,
        //         role_id,
        //     },
        // });
        const sql = `select * from user where room_id=${id} and role_id <= ${role_id}`;
        const ret = await app.mysql.query(sql);
        return ret;
    }
}

module.exports = UserService;
