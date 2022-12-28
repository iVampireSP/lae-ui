import { createRouter, createWebHistory } from 'vue-router';
import store from './store';
import app from '../config/app';
import { Tooltip, Toast } from 'bootstrap';

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/IndexNew.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },
  {
    path: '/birthdays',
    name: 'birthdays',
    component: () => import('../views/Birthdays.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
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
    component: () => import('../views/Hosts.vue'),
    meta: {
      auth: true,
      keepalive: true,
    },
  },
  {
    path: '/work-orders',
    name: 'work-orders',
    component: () => import('../views/work-orders/Index.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/work-orders/create',
    name: 'work-orders.create',
    component: () => import('../views/work-orders/Create.vue'),
  },
  {
    path: '/work-orders/:id',
    name: 'work-orders.show',
    component: () => import('../views/work-orders/Show.vue'),
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
      },
      {
        path: 'tunnels/compact',
        name: 'modules.tunnels.compact',
        component: () => import('../views/modules/tunnels/Compact.vue'),
      },
      {
        path: 'tunnels/downloads',
        name: 'modules.tunnels.download',
        component: () => import('../views/modules/tunnels/Download.vue'),
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
      {
        path: 'cdn',
        name: 'modules.cdn',
        component: () => import('../views/modules/cdn/Index.vue'),
      },
      {
        path: 'cdn/create',
        name: 'modules.cdn.create',
        props: true,
        component: () => import('../views/modules/cdn/Create.vue'),
      },
      {
        path: 'cdn/:id',
        name: 'modules.cdn.show',
        props: true,
        component: () => import('../views/modules/cdn/Show.vue'),
      },
      {
        path: 'user-mqtt',
        name: 'modules.user-mqtt',
        component: () => import('../views/modules/user-mqtt/Index.vue'),
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

  Array.from(document.querySelectorAll('.toast')).forEach(
    (toastNode) => new Toast(toastNode)
  );

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
