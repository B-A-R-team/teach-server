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
        const roomNum = await this.app.mysql.query('select count(*) as length from teach_room');
        const ret = await this.app.mysql.select('teach_room',
            {
                orders: [['create_time', 'desc']],
                limit: parseInt(pageSize),
                offset: parseInt(startNum),
            }
        );
        return {
            rooms: ret,
            length: roomNum[0].length,
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
}
module.exports = RoomService;
