/* eslint-disable array-bracket-spacing */
/* eslint-disable indent */
'use strict';
const path = require('path');

const { Service } = require('egg');
const swiperWhitelist = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.wbmp',
    '.webp',
    '.svg',
];
class SwiperService extends Service {
    async getSwiperData() {
        const { app } = this;
        const swiperNum = 5;
        const ret = await app.mysql.select('activity', {
            where: { advance: 1 },
            orders: [['start_time', 'desc']],
            columns: ['id', 'title', 'record_files', 'advance', 'start_time', 'end_time'],
            limit: swiperNum,
        });
        if (ret) {
            let record_files;
            ret.forEach((item, index) => {
                const myFile = [{ id: -1, filePath: `/public/swiper/${index + 1}.jpg` }];
                record_files = item.record_files ? JSON.parse(item.record_files) : myFile;
                record_files.forEach(fileItem => {
                    if (swiperWhitelist.some(whiteItem => whiteItem === path.extname(fileItem.filePath)) && myFile.length <= 1) {
                        myFile.push(fileItem);
                        return;
                    }
                });
                item.swiper = [myFile.pop()];
                delete item.record_files;
            });
        }
        return ret;
    }
}
module.exports = SwiperService;
