/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-03-31 16:40:39
 * @LastEditTime: 2021-04-21 17:36:33
 * @FilePath: \teach-research-server\app\service\user.js
 */
'use strict';

const Service = require('egg').Service;
const md5 = require('md5');
const secret = '123456';
const sqlTemp = `
        user.id as id,
        user.name as name,
        user.phone as phone,
        user.avatar as avatar,
        user.gender as gender,
        user.job_id as job_id,
        DATE_FORMAT(user.create_time,'%Y-%m-%d %H:%i:%s' ) as create_time,
        teach_room.id as room_id,
        teach_room.name as room_name,
        role.id as role_id,
        role.name as role_name
        from user
        left join teach_room on  user.room_id=teach_room.id
        left join role on  user.role_id=role.id  `;
class UserService extends Service {
    async findAll(params) {
        const { startNum, pageSize } = params;
        const roomNum = await this.app.mysql.query('select count(*) as length from user');
        const sql = `select 
        ${sqlTemp}
        limit ${startNum},${pageSize}
        `;
        const users = await this.app.mysql.query(sql);
        return { users, length: roomNum[0].length };
    }
    async register(info) {
        const { username, password, job_id, phone } = info;
        const jobRet = await this.app.mysql.get('user', {
            job_id,
        });
        if (jobRet) {
            return { msg: '此工号已存在' };
        }
        const ret = await this.app.mysql.insert('user',
            {
                name: username,
                password: md5(password + secret),
                job_id,
                phone,
            });
        console.log(ret);
        return ret;
    }
    async login(loginInfo) {
        let { job_id, password } = loginInfo;
        password = md5(password + secret);
        const ret = await this.app.mysql.select('user', {
            where: { job_id, password },
            // eslint-disable-next-line array-bracket-spacing
            columns: ['name', 'job_id', 'phone', 'avatar', 'role_id', 'id', 'room_id'],
            limit: 0, // 返回数据量
        });
        if (ret.length > 0) {
            const room = await this.app.mysql.select('teach_room', {
                where: { id: ret[0].room_id },
                // eslint-disable-next-line array-bracket-spacing
                columns: ['id', 'name'],
            });
            const roleInfo = await this.app.mysql.select('role', {
                where: { id: ret[0].role_id },
                // eslint-disable-next-line array-bracket-spacing
                columns: ['id', 'name', 'value', 'role_menu'],
            });
            ret[0].role = roleInfo[0];
            ret[0].room = room[0];
            delete ret[0].room_id;
            delete ret[0].role_id;
            return ret[0];
        }
        return {
            msg: '帐号或密码不正确',
        };
    }
    async findOneById(id) {
        const ret = await this.app.mysql.get('user', { id });
        console.log(ret);
        return ret;
    }
    async findUsersByRoomId(id) {
        const { ctx, app } = this;
        const { role_id } = ctx.state.user;
        const sql = `select ${sqlTemp} where room_id=${id} and role_id <= ${role_id}`;
        const ret = await app.mysql.query(sql);
        console.log(ret);
        return ret;
    }
    async updateUserInfo(params) {
        const { app, ctx } = this;
        let { id, phone, avatar, gender } = params;
        id = parseInt(id);
        gender = parseInt(gender);
        const token_user_id = ctx.state.user.id;
        if (id === token_user_id) {
            const ret = await app.mysql.update('user', {
                id,
                phone,
                avatar,
                gender,
            });
            if (ret.affectedRows === 1) {
                return {
                    ...params,
                    id,
                    gender,
                    msg: '修改成功',
                };
            }
            return {
                msg: '修改失败，请检查id',
            };
        }
        return {
            msg: '请不要做出这种行为',
        };

    }
}

module.exports = UserService;
