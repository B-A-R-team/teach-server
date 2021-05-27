/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-08 18:32:53
 * @LastEditTime: 2021-04-21 21:11:00
 * @FilePath: \teach-research-server\app\service\room.js
 */
'use strict';

const Service = require('egg').Service;

class RoomService extends Service {
    async findAllRoom(params) {
        const { startNum, pageSize } = params;
        const sql = `
            select 
             id, 
             name, 
             director_id, 
             f_director_id, 
             create_time,
             (select name from user where director_id = user.id) as director_name,
             (select name from user where f_director_id = user.id) as f_director_name
             from teach_room
             order by create_time desc
             limit ${startNum}, ${pageSize};
        `;
        const ret = await this.app.mysql.query(sql);
        const nums = await this.app.mysql.query('select FOUND_ROWS() as total from teach_room');
        if (ret) {
            if (ret.length > 0) {
                return {
                    rooms: ret,
                    length: nums[0].total,
                };
            }
            return {
                msg: '暂无',
            };

        }
        return {
            msg: '错误',
        };

    }
    async createRoom(params) {
        let { name, director_id, f_director_id } = params;
        director_id = parseInt(director_id) || null;
        f_director_id = parseInt(f_director_id) || null;
        const nameInfo = await this.app.mysql.get('teach_room', { name });
        if (!nameInfo) {
            const ret = await this.app.mysql.insert('teach_room', {
                name,
                director_id,
                f_director_id,
            });
            if (ret.affectedRows === 1) {
                return {
                    id: ret.insertId,
                    ...params,
                };
            }
            return { msg: '创建失败' };
        }
        return { msg: '该名称已存在' };

    }
    async updateRoom(params) {
        const { app } = this;
        let { id, name, director_id, f_director_id } = params;
        if (director_id) {
            director_id = parseInt(director_id);
            const sql = `update user set role_id=1 where role_id=3 and room_id=${id}`;
            await app.mysql.query(sql);
            const changeDirector = await app.mysql.update('user', {
                id: director_id,
                role_id: 3,
            });
            if (!changeDirector) {
                return {
                    msg: '变更主任失败',
                };
            }
        }
        if (f_director_id) {
            f_director_id = parseInt(f_director_id);
            const sql = `update user set role_id=1 where role_id=2 and room_id=${id}`;
            await app.mysql.query(sql);
            const changeFDirector = await app.mysql.update('user', {
                id: f_director_id,
                role_id: 2,
            });
            if (!changeFDirector) {
                return {
                    msg: '变更副主任失败',
                };
            }
        }
        const ret = await app.mysql.update('teach_room', {
            id,
            name,
            director_id,
            f_director_id,
        });
        if (ret.affectedRows === 1) {
            return {
                id,
                name,
                director_id,
                f_director_id,
                msg: '变更成功',
            };
        }
        return {
            msg: '更新失败',
        };
    }
    async deleteRoom(id) {
        const { app } = this;
        const teachers = await app.mysql.select('user', {
            where: {
                room_id: id,
            },
        });
        if (teachers.length > 0) {
            return {
                msg: '教研室还有成员时，不能删除教研室',
            };
        }
        const ret = await app.mysql.delete('teach_room', {
            id,
        });
        if (ret.affectedRows === 1) {
            return {
                msg: '删除成功',
            };
        }
        return {
            msg: '删除失败',
        };
    }
    // 往教研室添加用户
    async addUserToRoom({ id, room_id }) {
        const { app, ctx } = this;
        if (ctx.state.user.role_id >= 2) {
            const ret = await app.mysql.update('user', {
                id,
                room_id,
            });
            if (ret.affectedRows === 1) {
                return {
                    id: parseInt(id),
                    room_id: parseInt(room_id),
                    msg: '添加成功',
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
    // 根据username模糊查询
    async findLikeByRoom({ room_id, username }) {
        const { app } = this;
        const sql = `
            select * from user where room_id = ${room_id} and name like '%${username}%'
         `;
        const ret = await app.mysql.query(sql);
        return ret;
    }
    // 根据username模糊查询不在教研室的用户
    async findNoRoomUsers({ username }) {
        const { app } = this;
        const sql = `
            select * from user where room_id is null and name like '%${username}%'
         `;
        const ret = await app.mysql.query(sql);
        return ret;
    }
    // 得到某个教研室的信息
    async getRoomInfo({ room_id }) {
        const sql = `
            SELECT 
                id,
                name,
                director_id,
                f_director_id,
                (SELECT name FROM user WHERE id = director_id ) as director_name,
                (SELECT name FROM user WHERE id = f_director_id ) as f_director_name,
                (SELECT COUNT(id) FROM user WHERE room_id =${room_id} ) as people_count 
                FROM teach_room 
                where id = ${room_id}
        `;
        const ret = await this.app.mysql.query(sql);

        return ret;
    }
    async deleteUserFromRoom({ room_id, user_id }) {
        const { app } = this;
        const ret = await app.mysql.update('user', { room_id: null }, {
            where: {
                id: user_id,
                room_id,
            },
        });
        if (ret.affectedRows === 1) {
            return {
                user_id: parseInt(user_id),
                msg: '删除成功',
            };
        }
        return {
            msg: '删除失败',
        };
    }
    async addUsers(params) {
        const { app } = this;
        let { room_id, users } = params;
        users = JSON.parse(users);
        if (typeof users === 'string') {
            users = JSON.parse(users);
        }
        room_id = parseInt(room_id);
        const ret = await Promise.all(users.map(item => {
            return app.mysql.update('user', {
                id: item,
                room_id,
            });
        }));
        if (ret.every(item => item.affectedRows === 1)) {
            return { msg: '添加成功' };
        }
        return { msg: '添加失败' };
    }
}
module.exports = RoomService;
