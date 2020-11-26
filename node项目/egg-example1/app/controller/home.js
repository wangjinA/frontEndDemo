'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    let getResult = await this.app.mysql.get(
      'users', { "id": 1 }
    );
    console.log(getResult);
    ctx.body = 'hi, egg';
    ctx.body = 'hi, 66';
  }
}

module.exports = HomeController;
