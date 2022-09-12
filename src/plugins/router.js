import { createRouter, createWebHistory } from 'vue-router';
import store from './store';
import app from '../config/app';
import { Tooltip } from 'bootstrap';

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Index.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      keepalive: false,
      auth: false,
    },
    component: () => import('../views/auth/Login.vue'),
  },
  {
    path: '/billing/charge',
    name: 'billing.charge',
    component: () => import('../views/user/Charge.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/servers',
    name: 'servers',
    component: () => import('../views/Servers.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/Tasks.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },
  {
    path: '/hosts',
    name: 'hosts',
    component: () => import('../views/user/Hosts.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },

  // Modules
  {
    path: '/modules',
    name: 'modules',
    props: true,
    keepalived: false,
    meta: {
      auth: true,
    },
    children: [
      {
        path: 'tunnels',
        name: 'modules.tunnels',
        component: () => import('../views/modules/tunnels/Index.vue'),
        children: [],
      },
      {
        path: 'tunnels/:id',
        name: 'modules.tunnels.show',
        props: true,
        component: () => import('../views/modules/tunnels/Show.vue'),
      },
      {
        path: 'gct',
        name: 'modules.gct',
        component: () => import('../views/modules/gct/Index.vue'),
        children: [],
      },
      {
        path: 'gct/create',
        name: 'modules.gct.create',
        props: true,
        component: () => import('../views/modules/gct/Create.vue'),
      },
      {
        path: 'gct/:id',
        name: 'modules.gct.show',
        props: true,
        component: () => import('../views/modules/gct/Show.vue'),
      },
    ],
  },

  // Errors routes
  {
    path: '/errors/404',
    name: 'error.404',
    component: () => import('../views/errors/404.vue'),
    meta: {
      auth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// function view(fn: string) {
//     return import("../views/" + fn + ".vue");
// }

router.beforeEach((to, from) => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']",
  });

  if (to.matched.length === 0) {
    return router.push({ name: 'errors.404' });
  }

  if (to.meta.auth ?? true) {
    // validate login state
    if (store.state.token == null) {
      if (to.name === 'Login') {
        return true;
      } else {
        let query = {};
        if (from.query.token != null) {
          query = { token: from.query.token };
        }
        router.push({ name: 'login', query: query });
      }
      return false;
    } else {
      return true;
    }
  } else {
    // 无需登录
    // if (to.name === "Login") {
    //     window.$message.warning('已经进去了啦！');
    //     return false;
    // }
    document.title = app.name;

    return true;
  }
});

// console.log(router.options.routes);

store.subscribe((mutation, state) => {
  if (mutation.type === 'updateToken') {
    // get token
    const token = state.token;
    if (token === null) {
      router.push('/login');
    }
  }
});

export default router;
