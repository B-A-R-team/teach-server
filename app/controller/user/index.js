/*
 * @Author: lts
 * @Date: 2021-03-31 11:09:26
 * @LastEditTime: 2021-04-05 18:21:28
 * @FilePath: \teach-research-server\app\controller\user\index.js
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async getAllUsers() {
    const { ctx } = this;
    console.log(ctx.state.user);
    const allUsers = await ctx.service.user.findAll();
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
    console.log(ret);
    if (ret.id) {
      const token = app.jwt.sign({
        job_id: loginInfo.job_id,
        role_id: ret.role_id,
      }, app.config.jwt.secret);
      ctx.body = {
        code: 200,
        data: {
          ...ret,
          token,
        },
      };
    }

  }
  async getUserById() {
    const { ctx } = this;
    const { id } = ctx.query;
    const ret = await ctx.service.user.findOneById(id);
    console.log(ret);
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
}

module.exports = UserController;
