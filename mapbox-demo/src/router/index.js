/*
 * @Author: 梁智超
 * @Date: 2020-11-11 15:56:46
 * @LastEditors: 梁智超
 * @LastEditTime: 2020-11-11 17:06:26
 * @Description: 路由配置
 */
import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Map from '../views/mapbox.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Map
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
