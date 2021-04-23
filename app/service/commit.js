/* eslint-disable indent */
/*
 * @Author: lts
 * @Date: 2021-04-08 21:42:11
 * @LastEditTime: 2021-04-10 11:31:52
 * @FilePath: \teach-research-server\app\service\commit.js
 */
'use strict';

const { Service } = require('egg');

class CommitService extends Service {
    async getAllByActive(id) {
        const { app } = this;
        const sql = `
                select commit.id as id,
                commit.content as content,
                commit.files as files,
                commit.user_id as user_id,
                commit.active_id as active_id,
                DATE_FORMAT(commit.create_time,'%Y-%m-%d %H:%i:%s' ) as create_time,
                user.name as username,
                user.avatar as avatar,
                user.role_id as role_id,
                user.job_id as job_id,
                user.phone as phone
                from commit LEFT JOIN user ON user.id =user_id WHERE commit.active_id=${id}
                order by create_time desc
            `;
        const ret = await app.mysql.query(sql);
        ret.forEach(item => {
            const { user_id, avatar, username, role_id, job_id, phone } = item;
            item.user = {
                id: user_id,
                name: username,
                avatar,
                role_id,
                job_id,
                phone,
            };
            delete item.user_id;
            delete item.avatar;
            delete item.username;
            delete item.role_id;
            delete item.job_id;
            delete item.phone;
        });
        return ret;
    }
    async createCommit(params) {
        const { app } = this;
        const { content, files, user_id, active_id } = params;
        params.user_id = parseInt(user_id);
        params.active_id = parseInt(active_id);
        const ret = await app.mysql.insert('commit', {
            content,
            files,
            user_id,
            active_id,
        });
        if (ret.affectedRows === 1) {
            return {
                id: ret.insertId,
                ...params,
                msg: '插入成功',

            };
        }
        return {
            msg: '插入失败',
        };
    }
}
module.exports = CommitService;
