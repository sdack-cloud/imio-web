import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Index.vue'),
        meta: {
            title: '首页'
        },
    },
    {
        path: '/demo',
        name: 'Demo',
        component: () => import('@/components/Demo'),
        meta: {
            title: '演示页面'
        }
    },
    {
        path: '/user',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/settings',
        name: 'AppSettings',
        component: () => import('@/views/AppSettings.vue'),
        meta: {
            title: '应用设置'
        }
    }
]

/**
 * 在主框架内显示
 */

const frameIn : RouteRecordRaw[] = [

];

/**
 * 在主框架之外显示,不用认证
 */

const frameOut : RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/views/Index.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/home/Home.vue'),
                meta: {
                    title: '主页'
                }
            },
            {
                path: '/dialog',
                name: 'Dialog',
                component: () => import('@/views/home/Dialog.vue'),
                meta: {
                    title: '对话'
                }
            },
            {
                path: '/contact',
                name: 'Contact',
                component: () => import('@/views/home/Contact.vue'),
                meta: {
                    title: '联系人'
                }
            },
            {
                path: '/me',
                name: 'Me',
                component: () => import('@/views/home/Me.vue'),
                meta: {
                    title: '我'
                }
            },
        ]
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/chat/Chat.vue'),
        meta: {
            title: '对话'
        }
    },
    {
        path: '/buddyInfo',
        name: 'BuddyInfo',
        component: () => import('@/views/chat/BuddyInfo.vue'),
        meta: {
            title: '好友详情'
        }
    },
    {
        path: '/roomInfo',
        name: 'roomInfo',
        component: () => import('@/views/chat/RoomInfo.vue'),
        meta: {
            title: '群详情'
        }
    },

    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/Profile.vue'),
        meta: {
            title: '我的主页'
        }
    },
    {
        path: '/roomProfile',
        name: 'RoomProfile',
        component: () => import('@/views/profile/RoomProfile.vue'),
        meta: {
            title: '群资料'
        }
    },
    {
        path: '/UserProfile',
        name: 'userProfile',
        component: () => import('@/views/profile/UserProfile.vue'),
        meta: {
            title: '人员资料'
        }
    },
    {
        path: '/addApply',
        name: 'AddApply',
        component: () => import('@/views/search/AddApply.vue'),
        meta: {
            title: '添加申请'
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/search/Search.vue'),
        meta: {
            title: '查找好友'
        }
    },
    {
        path: '/roomNotice',
        name: 'RoomNotice',
        component: () => import('@/views/notice/RoomNotice.vue'),
        meta: {
            title: '群通知'
        }
    },
    {
        path: '/newBuddyNotice',
        name: 'NewBuddyNotice',
        component: () => import('@/views/notice/NewBuddyNotice.vue'),
        meta: {
            title: '新朋友'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import('@/views/login/SignUp.vue'),
        meta: {
            title: '注册'
        }
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import('@/views/login/Forgot.vue'),
        meta: {
            title: '忘记密码'
        }
    },

]

const errorPage: RouteRecordRaw[] = [
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: '404'
        }
    },
    {
        path: '/500',
        name: '5000',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: '500'
        }
    },
]

export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]