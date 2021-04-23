/* eslint-disable indent */
'use strict';

const { Service } = require('egg');

class UploadService extends Service {
    async saveRecord(params) {
        const { app } = this;
        let { active_id, user_id, filePath } = params;
        active_id = parseInt(active_id);
        user_id = parseInt(user_id);
        const active = await app.mysql.get('activity', { id: active_id });
        if (active) {
            const user = await app.mysql.get('user', { id: user_id });
            if (!user) {
                return {
                    msg: '用户不存在',
                };
            }
            const files = JSON.parse(active.record_files || '[]');
            files.push({
                user_id,
                filePath,
            });
            const saveRet = await app.mysql.update('activity', {
                id: active_id,
                record_files: JSON.stringify(files),
            });
            if (saveRet.affectedRows === 1) {
                return {
                    ...params,
                    msg: '更新成功',
                };
            }
            return {
                msg: '更新失败',
            };
        }
        return {
            msg: '活动不存在',
        };
    }
    async updateAvatar(params) {
        const { app } = this;
        let { user_id, filePath } = params;
        user_id = parseInt(user_id);
        const userRet = await app.mysql.get('user', {
            id: user_id,
        });
        if (userRet) {
            const updateA = await app.mysql.update('user', {
                id: user_id,
                avatar: filePath,
            });
            if (updateA.affectedRows === 1) {
                return {
                    ...params,
                    msg: '成功更换头像',
                };
            }
            return {
                msg: '修改头像失败',
            };
        }
        return {
            msg: '用户不存在',
        };
    }
    async getAvatar(user_id) {
        let filePath = null;
        const ret = await this.app.mysql.get('user', {
            id: user_id,
        });
        if (ret) {
            filePath = ret.avatar;
        }
        return { filePath };
    }
}
module.exports = UploadService;
