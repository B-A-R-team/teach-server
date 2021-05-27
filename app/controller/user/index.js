/*
 * @Author: lts
 * @Date: 2021-03-31 11:09:26
 * @LastEditTime: 2021-04-21 17:37:10
 * @FilePath: \teach-research-server\app\controller\user\index.js
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async getAllUsers() {
    const { ctx } = this;
    const params = ctx.query;
    const allUsers = await ctx.service.user.findAll(params);
    ctx.body = {
      code: 200,
      data: allUsers,
    };
  }
  async register() {
    const { ctx } = this;
    const sign = ctx.request.body;
    const ret = await ctx.service.user.register(sign);
    if (ret.affectedRows === 1) {
      ctx.body = {
        code: 200,
        data: {
          id: ret.insertId,
          username: sign.username,
          phone: sign.phone,
          job_id: sign.job_id,
        },
      };
    } else {
      ctx.body = {
        code: 500,
        ret,
      };
    }

  }
  async login() {
    const { ctx, app } = this;
    const loginInfo = ctx.request.body;
    const ret = await ctx.service.user.login(loginInfo);
    if (ret.id) {
      const token = app.jwt.sign({
        id: ret.id,
        job_id: loginInfo.job_id,
        role_id: ret.role.id,
      }, app.config.jwt.secret);
      // eslint-disable-next-line no-return-assign
      return ctx.body = {
        code: 200,
        data: {
          ...ret,
          token,
        },
      };
    }
    ctx.body = {
      code: 200,
      data: { ...ret },
    };

  }
  async getUserById() {
    const { ctx } = this;
    const { id } = ctx.query;
    const ret = await ctx.service.user.findOneById(id);
    if (ret) {
      ctx.body = {
        code: 200,
        data: ret,
      };
    } else {
      ctx.body = {
        code: 200,
        data: {
          msg: '用户不存在',
        },
      };
    }
  }
  async getUsersByRoomId() {
    const { ctx } = this;
    const { id } = ctx.query;
    const ret = await ctx.service.user.findUsersByRoomId(id);
    if (ret) {
      ctx.body = {
        code: 200,
        data: ret,
      };
    } else {
      ctx.body = {
        code: 200,
        data: {
          msg: '团队不存在',
        },
      };
    }
  }
  async updateUserInfo() {
    const { ctx } = this;
    const params = ctx.request.body;
    const ret = await ctx.service.user.updateUserInfo(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async findLikeAllUsers() {
    const { ctx } = this;
    const params = ctx.query;
    const ret = await ctx.service.user.findLikeAllUsers(params);
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
  async getNoRoomUsers() {
    const { ctx } = this;
    const ret = await ctx.service.user.findNoRoomUsers();
    ctx.body = {
      code: 200,
      data: ret,
    };
  }
}

module.exports = UserController;
