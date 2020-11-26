'use strict';

const Controller = require('egg').Controller;

class PetController extends Controller {
  async getList() {
    const { ctx } = this;
    const user = await ctx.service.user.find(1);
    // console.log(getResult);
    ctx.body = user;
  }
}

module.exports = PetController;
