/*
 * @Author: 汪锦
 * @Date: 2020-11-18 17:29:33
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-11-18 17:39:22
 * @Description: 文件描述
 */
const Service = require('egg').Service;
class UserService extends Service {
  async find(id) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const user = await this.app.mysql.get('users', { id: id });
    return { user };
  }
}
module.exports = UserService;