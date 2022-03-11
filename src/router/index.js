import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/Home",
    name: "Home",
    component: Home,
    children: [
      {
        name: "index",
        path: "index",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/index.vue"
          ),
        meta: {
          title: "用户主页",
        },
      },
      {
        name: "error",
        path: "error",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/401.vue"
          ),
        meta: {
          title: "我的荣誉",
        },
      },
      {
        name: "我的荣誉",
        path: "wdry",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/wdry.vue"
          ),
        meta: {
          title: "我的荣誉",
        },
      },
      {
        name: "hjxxtj",
        path: "hjxxtj",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/hjxxtj.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "获奖信息提交",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("applyAdd") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "hjxxcs",
        path: "hjxxcs",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/hjxxcs.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "获奖信息初审",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("auditCommand") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "hjxxzs",
        path: "hjxxzs",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/hjxxzs.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "获奖信息终审",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("auditPass") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "hjxxdr",
        path: "hjxxdr",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/hjxxdr.vue"
          ),
        meta: {
          title: "获奖信息导入",
        },
      },
      {
        name: "xkjsflb",
        path: "xkjsflb",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/xkjsflb.vue"
          ),
        meta: {
          title: "学科竞赛分类表",
        },
      },
      {
        name: "xsrysq",
        path: "xsrysq",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/xsrysq.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "学生荣誉申请",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("applyAdd") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "tjryhd",
        path: "tjryhd",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/tjryhd.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "添加荣誉活动",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("award") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "ryps",
        path: "ryps",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/ryps.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "荣誉评审",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("award") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "drxkjsflb",
        path: "drxkjsflb",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/drxkjsflb.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "导入学科竞赛分类表",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("courseContestsLoading") == 1) {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
      {
        name: "yhqxgl",
        path: "yhqxgl",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/pages/yhqxgl.vue"
          ),
        meta: {
          isAuth: true, // 配置是否需要
          title: "用户权限管理",
        },
        beforeEnter(to, from, next) {
          if (sessionStorage.getItem("pos") === '"admin"') {
            next();
          } else {
            next('/Home/error');
          }
        },
      },
    ],
  },
  {
    path: "/",
    name: "login_must",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login_must"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
