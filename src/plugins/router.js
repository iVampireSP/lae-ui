import {createRouter, createWebHistory} from 'vue-router';

import user from './stores/user';
import app from '../config/app';

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../views/Index.vue'),
        meta: {
            auth: true,
            keepalive: true,
            title: '欢迎',
        },
    },
    // {
    //   path: '/birthdays',
    //   name: 'birthdays',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/Birthdays.vue'),
    //   meta: {
    //     auth: true,
    //     keepalive: true,
    //     title: '繁星',
    //   },
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/About.vue'),
    //   meta: {
    //     auth: true,
    //     keepalive: true,
    //     title: '关于',
    //   },
    // },
    {
        path: '/auth/login',
        name: 'auth.login',
        meta: {
            auth: false,
            title: '登录',
        },
        component: () => import('../views/users/Login.vue'),
    },
    {
        path: '/user',
        name: 'user',
        meta: {
            hides: ['left'],
            title: '用户中心',
        },
        component: () => import('../views/users/User.vue'),

    },
    // {
    //   path: '/servers',
    //   name: 'servers',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/Servers.vue'),
    //   meta: {
    //     auth: true,
    //     keepalive: true,
    //     title: '服务器状态',
    //   },
    // },
    // {
    //   path: '/tasks',
    //   name: 'tasks',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/Tasks.vue'),
    //   meta: {
    //     auth: true,
    //     keepalive: true,
    //     title: '任务队列',
    //   },
    // },
    // {
    //   path: '/hosts',
    //   name: 'hosts',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/Hosts.vue'),
    //   meta: {
    //     auth: true,
    //     keepalive: true,
    //     title: '主机 - 计费项目列表',
    //   },
    // },
    // {
    //   path: '/work-orders',
    //   name: 'work-orders',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/work-orders/Index.vue'),
    //   meta: {
    //     auth: true,
    //     title: '工单',
    //   },
    // },
    // {
    //   path: '/work-orders/create',
    //   name: 'work-orders.create',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/work-orders/Create.vue'),
    //   meta: {
    //     title: '创建工单',
    //     auth: false,
    //   },
    // },
    // {
    //   path: '/work-orders/:id',
    //   name: 'work-orders.show',
    //   component: () => import('../../../../Downloads/lae-ui-main/src/views/work-orders/Show.vue'),
    //   meta: {
    //     title: '跟进工单',
    //     auth: false,
    //   },
    // },
    //


    // Modules
    {
        path: '/modules',
        name: 'modules',
        props: true,
        component: () => import('../views/modules/Base.vue'),

        meta: {
            auth: true,
        },
        children: [
            {
                path: 'tunnels',
                // name: 'modules.tunnels',
                component: () => import('../views/modules/tunnels/Base.vue'),
                meta: {
                    title: 'ME Frp',
                },
                children: [
                    {
                        path: '',
                        name: 'modules.tunnels.index',
                        component: () => import('../views/modules/tunnels/Index.vue'),
                    },
                    {
                        path: 'create',
                        name: 'modules.tunnels.create',
                        component: () => import('../views/modules/tunnels/Create.vue'),
                    },
                    {
                        path: 'compact',
                        name: 'modules.tunnels.compact',
                        component: () => import('../views/modules/tunnels/Compact.vue'),
                    },
                    {
                        path: ':id',
                        name: 'modules.tunnels.show',
                        component: () => import('../views/modules/tunnels/Show.vue'),
                    }
                ]
            },
            //
            // {
            //     path: 'gct',
            //     name: 'modules.gct',
            //     component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/gct/Index.vue'),
            //     meta: {
            //         title: '游戏容器',
            //     },
            // },
            // {
            //     path: 'gct/create',
            //     name: 'modules.gct.create',
            //     props: true,
            //     component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/gct/Create.vue'),
            //     meta: {
            //         title: '创建容器',
            //     },
            // },
            // {
            //     path: 'gct/intro',
            //     name: 'modules.gct.intro',
            //     props: true,
            //     component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/gct/Intro.vue'),
            //     meta: {
            //         title: '引导创建',
            //     },
            // },
            // {
            //     path: 'gct/:id',
            //     name: 'modules.gct.show',
            //     props: true,
            //     component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/gct/Show.vue'),
            //     meta: {
            //         title: '显示游戏容器',
            //     },
            // },
            // {
            //   path: 'cdn',
            //   name: 'modules.cdn',
            //   component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/cdn/Index.vue'),
            // },
            // {
            //   path: 'cdn/create',
            //   name: 'modules.cdn.create',
            //   props: true,
            //   component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/cdn/Create.vue'),
            // },
            // {
            //   path: 'cdn/:id',
            //   name: 'modules.cdn.show',
            //   props: true,
            //   component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/cdn/Show.vue'),
            // },
            // {
            //   path: 'user-mqtt',
            //   name: 'modules.user-mqtt',
            //   component: () => import('../../../../Downloads/lae-ui-main/src/views/modules/user-mqtt/Index.vue'),
            //   meta: {
            //     title: '用户消息队列',
            //   },
            // },
        ],
    },

    // Errors routes
    {
        path: '/errors/404',
        name: 'errors.404',
        component: () => import('../views/errors/404.vue'),
        meta: {
            auth: false,
        },
    },
    {
        path: '/:catchAll(.*)',
        redirect: {
            name: "errors.404"
        }
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from) => {
    if (to.matched.length === 0) {
        return router.push({name: 'errors.404'});
    }

    if (to.meta.title) {
        document.title = to.meta.title + ' - ' + app.name;
    } else {
        document.title = app.name;
    }

    if (to.meta.auth ?? true) {
        // validate login state
        if (user.state.token == null) {
            if (to.name === 'auth.login') {
                return true;
            } else {
                let query = {};
                if (from.query.token != null) {
                    query = {token: from.query.token};
                }
                router.push({name: 'auth.login', query: query});
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

export default router;
