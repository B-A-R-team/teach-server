/* eslint-disable array-bracket-spacing */
/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-06 08:42:49
 * @LastEditTime: 2021-04-21 17:08:33
 * @FilePath: \teach-research-server\app\service\activity.js
 */
'use strict';

const Service = require('egg').Service;
const path = require('path');
const temp = `
            activity.id as id,
            activity.leader_id as leader_id,
            activity.content as content,
            activity.title as title,
            activity.join_users as join_users,
            FROM_UNIXTIME(activity.start_time/1000,'%Y-%m-%d %H:%i:%s') as start_time,
            FROM_UNIXTIME(activity.end_time/1000,'%Y-%m-%d %H:%i:%s') as end_time,
            activity.advance as advance,
            user.name AS username,
            user.avatar as avatar,
            user.role_id as role_id,
            user.job_id as job_id,
            user.phone as phone,
            teach_room.id as room_id,
            teach_room.name as room_name
            from activity 
            left join user on  user.id=activity.leader_id  
            left join teach_room on  activity.room_id=teach_room.id  
        `;
const swiperWhitelist = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.wbmp',
    '.webp',
    '.svg',
];
function changeRet(ret) {
    ret.forEach(item => {
        const { leader_id, avatar, username, role_id, job_id, phone, room_id, room_name } = item;
        item.leader = {
            id: leader_id,
            name: username,
            avatar,
            role_id,
            job_id,
            phone,
        };
        item.room = {
            id: room_id,
            name: room_name,
        };
        delete item.leader_id;
        delete item.avatar;
        delete item.username;
        delete item.role_id;
        delete item.job_id;
        delete item.phone;
        delete item.room_id;
        delete item.room_name;
    });
}
class ActiveService extends Service {
    async findAll() {
        const { app } = this;
        // const ret = await app.mysql.select('activity', {
        //     orders: [[ 'create_time', 'desc' ]],
        // });
        const sql = `select ${temp} where advance=1 order by start_time desc`;
        const ret = await app.mysql.query(sql);
        if (ret[0]) {
            changeRet(ret);
        }
        return ret;
    }
    async getActivesByType(type) {
        const { app } = this;
        const time = Date.now();
        let ret;
        let sql = '';
        switch (type) {
            case 'will':
                sql = `select ${temp} where start_time > ${time} and advance=1`;
                break;
            case 'doing':
                sql = `select ${temp}  where start_time <= ${time} and end_time > ${time} and advance=1`;
                break;
            case 'done':
                sql = `select ${temp}  where end_time <= ${time} and advance=1`;
                break;
            default:
                ret = '传入的参数值错误';
                break;
        }
        if (sql.length > 10) {
            ret = await app.mysql.query(sql);
            if (ret[0]) {
                changeRet(ret);
            }
            return ret;
        }
        return { error: ret };
    }
    async getActiveById(params) {
        let ret;
        let sql = '';
        if (params.id && params.type) {
            switch (params.type) {
                case 'act':
                    sql = `
                            select activity.leader_id as leader_id,
                            activity.content as content,
                            activity.title as title,
                            activity.join_users as join_users,
                            FROM_UNIXTIME(activity.start_time/1000,'%Y-%m-%d %H:%i:%s') as start_time,
                            FROM_UNIXTIME(activity.end_time/1000,'%Y-%m-%d %H:%i:%s') as end_time,
                            activity.room_id as room_id,
                            user.name AS username,
                            user.avatar as avatar,
                            user.role_id as role_id,
                            user.job_id as job_id,
                            user.phone as phone
                            from activity left join user on  user.id=activity.leader_id  where activity.id=${params.id}
                            `;
                    break;
                case 'room':
                    sql = `select ${temp}  where room_id=${params.id}`;
                    break;

                default:
                    ret = '请传入正确参数';
                    break;
            }
            if (sql.length > 10) {
                ret = await this.app.mysql.query(sql);
                if (params.type === 'act' && ret.length > 0) {
                    ret = ret[0];
                    const { leader_id, avatar, username, role_id, job_id, phone } = ret;
                    ret.leader = {
                        id: leader_id,
                        name: username,
                        avatar,
                        role_id,
                        job_id,
                        phone,
                    };
                    delete ret.leader_id;
                    delete ret.avatar;
                    delete ret.username;
                    delete ret.role_id;
                    delete ret.job_id;
                    delete ret.phone;
                } else if (ret.length === 0) {
                    return {
                        msg: '暂无活动',
                    };

                }
                return ret;
            }
            return { error: ret };
        }
        return { error: '请传入正确参数' };
    }
    async updateActiveById(activeInfo) {
        const { id, title, content, files, start_time, end_time } = activeInfo;
        const sql = `
            update activity set 
            title='${title}',
            content='${content}',
            files='${files}',
            start_time='${start_time}',
            end_time='${end_time}' where id=${id} and advance=0
        `;
        const ret = await this.app.mysql.query(sql);
        // const ret = await this.app.mysql.update('active', row);
        if (ret.affectedRows === 1) {
            return {
                ...activeInfo,
                msg: '修改成功',
            };
        }
        return {
            msg: '修改失败',
        };
    }
    // 预发布活动
    async createActive(activeInfo) {
        const { title, content, files, start_time, leader_id, room_id, join_users, end_time } = activeInfo;
        const ret = await this.app.mysql.insert('activity', {
            title,
            content,
            files,
            leader_id,
            join_users,
            room_id,
            start_time,
            end_time,
        });
        if (ret.affectedRows === 1) {
            return {
                id: ret.insertId,
                ...activeInfo,
                room_id: parseInt(room_id),
                leader_id: parseInt(leader_id),
            };
        }
        return {
            msg: '异常',
        };
    }
    async deleteActiveById(id) {
        const { app } = this;
        const currInfo = await app.mysql.get('activity', { id });
        console.log(currInfo);
        if (currInfo && currInfo.leader_id) {
            if (currInfo.advance === 0) {
                const ret = await app.mysql.delete('activity', { id: currInfo.id });
                if (ret.affectedRows === 1) {
                    return {
                        ...currInfo,
                        msg: '删除成功',
                    };
                }
                return {
                    msg: '删除失败',
                };
            }
            return {
                msg: '删除失败，不能删除以发布的活动',
            };
        }
        return {
            msg: '删除失败',
        };
    }
    async getAdvanceByUserId() {
        const { ctx, app } = this;
        const { id, role_id } = ctx.state.user;
        if (role_id >= 2) {
            const ret = await app.mysql.select('activity', {
                where: {
                    leader_id: id,
                    advance: 0,
                },
            });
            if (ret) {
                return ret;
            }
            return {
                msg: '查询失败',
            };
        }
        return {
            msg: '权限不足',
        };
    }
    async issueAdvance(id) {
        const { ctx, app } = this;
        const { role_id } = ctx.state.user;
        if (role_id > 1) {
            const ret = await app.mysql.get('activity', {
                id,
            });
            if (ret.id && ret.advance === 0) {
                const join_users = JSON.parse(ret.join_users);
                let trueNum = 0;
                join_users.forEach(item => {
                    if (item.is_ok) {
                        trueNum++;
                    }
                });
                if (trueNum > join_users.length / 2) {
                    const issueRet = await app.mysql.update('activity', {
                        id,
                        advance: 1,
                    });
                    if (issueRet.affectedRows === 1) {
                        return {
                            msg: '发布成功',
                        };
                    }
                    return issueRet;
                }
                return {
                    msg: '活动未通过，不能发布',
                };
            }
            return {
                msg: '发布失败',
            };
        }
        return {
            msg: '没有权限',
        };
    }
    async getPersonActives(params) {
        let { user_id, room_id, advance } = params;
        user_id = parseInt(user_id);
        room_id = parseInt(room_id);
        const { app } = this;
        let ret;
        if (advance !== undefined && advance !== null) {
            ret = await app.mysql.select('activity', {
                where: {
                    room_id,
                    advance,
                },
                orders: [['start_time', 'desc']],
            });
        } else {
            ret = await app.mysql.select('activity', {
                where: {
                    room_id,
                },
                orders: [['start_time', 'desc']],
            });
        }
        if (ret) {
            const myArr = [];
            let record_files;
            ret.forEach((item, index) => {
                const num = index % 5;
                let join_users;
                try {
                    join_users = JSON.parse(item.join_users);
                } catch (error) {
                    join_users = [{ msg: '数据出错' }];
                }

                const flag = join_users.some(users => users.user_id === user_id);
                flag && myArr.push(item);
                const myFile = [{ id: -1, filePath: `/public/swiper/${num + 1}.jpg` }];
                record_files = item.record_files ? JSON.parse(item.record_files) : myFile;
                record_files.forEach(fileItem => {
                    if (swiperWhitelist.some(whiteItem => whiteItem === path.extname(fileItem.filePath)) && myFile.length <= 1) {
                        myFile.push(fileItem);
                        return;
                    }
                });
                item.img = [myFile.pop()];
                delete item.record_files;

            });
            return myArr;
        }
        return {
            msg: '未知错误',
        };

    }
    async agreeActive(params) {
        const { user_id, active_id, is_agree } = params;
        const { app } = this;
        const ret = await app.mysql.select('activity', {
            where: {
                id: active_id,
                advance: 0,
            },
            columns: ['join_users'],
        });
        if (ret[0]) {
            // console.log(ret[0].join_users)
            const join_users = JSON.parse(ret[0].join_users);
            join_users.forEach(item => {
                if (item.user_id === parseInt(user_id)) {
                    item.is_ok = (is_agree === 'true');
                }
            });
            const agree = await app.mysql.update('activity', {
                id: active_id,
                join_users: JSON.stringify(join_users),
            });
            if (agree.affectedRows === 1) {
                if (is_agree === 'true') {
                    return {
                        msg: '赞同此活动',
                    };
                }
                return {
                    msg: '反对此活动',
                };
            }
            return {
                msg: '更新失败，未知错误',
            };
        }
        // const ret = await app.mysql.update
        return {
            msg: '请检查活动是否是预发布',
        };
    }
}

module.exports = ActiveService;
