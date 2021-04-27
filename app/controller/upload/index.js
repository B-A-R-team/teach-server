/* eslint-disable no-return-assign */
/* eslint-disable indent */
'use strict';

const { Controller } = require('egg');
const path = require('path');
const fs = require('fs');
const avatarWhitelist = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.wbmp',
    '.webp',
    '.svg',
];
class UploadController extends Controller {
    async uploadRecord() {
        const { ctx } = this;
        const params = ctx.request.body;
        const { active_id, user_id } = params;
        const file = ctx.request.files[0];
        if (!file) {
            return ctx.body = {
                code: 401,
                msg: '请选择文件',
            };
        }
        const oldFilename = file.filename;
        const filename = `act-${active_id}--u_id-${user_id}--` + Date.now() + path.extname(file.filename).toLocaleLowerCase();
        const filePath = `/public/upload/active-record/${filename}`;
        try {
            fs.readFile(file.filepath, (err, fileData) => {
                fs.writeFileSync(path.join(__dirname, `../..${filePath}`), fileData);
            });
        } catch (error) {
            return ctx.body = { code: 200, data: error };
        }
        const ret = await ctx.service.upload.saveRecord({ ...params, filePath, oldFilename });
        ctx.body = { code: 200, data: ret };
    }
    async uploadAvatar() {
        const { ctx } = this;
        const user_id = ctx.state.user.id;
        const file = ctx.request.files[0];
        if (!file) {
            return ctx.body = {
                code: 401,
                data: {
                    msg: '请选择文件',
                },
            };
        }
        const isImg = avatarWhitelist.some(item => item === path.extname(file.filename));
        if (isImg) {
            const oldAvatar = await ctx.service.upload.getAvatar(user_id);

            if (oldAvatar.filePath) {
                if (fs.existsSync(path.join(__dirname, `../..${oldAvatar.filePath}`))) {
                    try {
                        fs.unlinkSync(path.join(__dirname, `../..${oldAvatar.filePath}`));
                    } catch (error) {
                        throw ('删除失败' + error);
                    }
                }
            }
            const filename = `avatar-u_id-${user_id}--` + Date.now() + path.extname(file.filename).toLocaleLowerCase();
            const filePath = `/public/upload/avatar/${filename}`;
            fs.readFile(file.filepath, (err, fileData) => {
                fs.writeFileSync(path.join(__dirname, `../..${filePath}`), fileData);
            });
            const ret = await ctx.service.upload.updateAvatar({ user_id, filePath });
            return ctx.body = {
                code: 200,
                data: ret,
            };

        }
        return {
            code: 200,
            data: {
                msg: '只能上传图片',
            },
        };
    }
}
module.exports = UploadController;
