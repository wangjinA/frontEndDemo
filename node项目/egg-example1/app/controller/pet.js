'use strict';

const Controller = require('egg').Controller;

class PetController extends Controller {
  async getList() {
    const { ctx } = this;
    let getResult = await this.app.mysql.get(
      'pet'
    );
    console.log(getResult);
    ctx.body = getResult;
  }
}

module.exports = PetController;
