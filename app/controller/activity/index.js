/*
 * @Author: lts
 * @Date: 2021-04-06 08:42:01
 * @LastEditTime: 2021-04-12 15:44:11
 * @FilePath: \teach-research-server\app\controller\activity\index.js
 */
'use strict';

const Controller = require('egg').Controller;

class ActiveController extends Controller {
  async getAllActivities() {
    const { ctx } = this;
    const Activities = await ctx.service.activity.findAll();
    ctx.body = {
      code: 200,
      data: Activities,
    };
  }
  async getActivesByType() {
    const { ctx } = this;
    const params = ctx.query;
    const ret = await ctx.service.activity.getActivesByType(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async getActiveById() {
    const { ctx } = this;
    const params = ctx.query;
    const ret = await ctx.service.activity.getActiveById(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async updateActiveById() {
    const { ctx } = this;
    const params = ctx.request.body;
    const ret = await ctx.service.activity.updateActiveById(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async createActive() {
    const { ctx } = this;
    const params = ctx.request.body;
    const ret = await ctx.service.activity.createActive(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async deleteActiveById() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const ret = await ctx.service.activity.deleteActiveById(id);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async getAdvanceByUserId() {
    const { ctx } = this;
    const ret = await ctx.service.activity.getAdvanceByUserId();
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async issueAdvance() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const ret = await ctx.service.activity.issueAdvance(id);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async getPersonActives() {
    const { ctx } = this;
    const params = ctx.query;
    const ret = await ctx.service.activity.getPersonActives(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async agreeActive() {
    const { ctx } = this;
    const params = ctx.request.body;
    const ret = await ctx.service.activity.agreeActive(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async getActivesByDay() {
    const { ctx } = this;
    const { time } = ctx.query;
    const ret = await ctx.service.activity.getActivesByDay(time);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
}

module.exports = ActiveController;
