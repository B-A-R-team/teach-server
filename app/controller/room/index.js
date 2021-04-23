/*
 * @Author: lts
 * @Date: 2021-04-08 18:32:28
 * @LastEditTime: 2021-04-21 18:19:26
 * @FilePath: \teach-research-server\app\controller\room\index.js
 */
'use strict';

const { Controller } = require('egg');

class RoomContorler extends Controller {
  async getAllRoom() {
    const param = this.ctx.query;
    const ret = await this.ctx.service.room.findAllRoom(param);
    this.ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async createRoom() {
    const { ctx } = this;
    const params = ctx.request.body;
    const ret = await ctx.service.room.createRoom(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async updateRoom() {
    const { ctx } = this;
    const params = ctx.request.body;
    const ret = await ctx.service.room.updateRoom(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async deleteRoom() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const ret = await ctx.service.room.deleteRoom(id);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
}
module.exports = RoomContorler;
