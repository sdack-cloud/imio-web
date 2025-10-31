import type { RouteRecordRaw } from 'vue-router'


/**
 * 在主框架内显示
 */

const frameIn : RouteRecordRaw[] = [
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/chat/Chat.vue'),
        meta: {
            title: '对话',
            auth: true
        }
    },
    {
        path: '/buddyInfo',
        name: 'BuddyInfo',
        component: () => import('@/views/chat/BuddyInfo.vue'),
        meta: {
            title: '好友详情',
            auth: true
        }
    },
    {
        path: '/roomInfo',
        name: 'roomInfo',
        component: () => import('@/views/chat/RoomInfo.vue'),
        meta: {
            title: '群详情',
            auth: true
        }
    },

    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/Profile.vue'),
        meta: {
            title: '我的主页',
            auth: true
        }
    },
    {
        path: '/memberList',
        name: 'MemberList',
        component: () => import('@/views/profile/MemberList.vue'),
        meta: {
            title: '群成员',
            auth: true
        }
    },
    {
        path: '/roomProfile',
        name: 'RoomProfile',
        component: () => import('@/views/profile/RoomProfile.vue'),
        meta: {
            title: '群资料',
            auth: true
        }
    },
    {
        path: '/UserProfile',
        name: 'userProfile',
        component: () => import('@/views/profile/UserProfile.vue'),
        meta: {
            title: '人员资料',
            auth: true
        }
    },
    {
        path: '/addApply',
        name: 'AddApply',
        component: () => import('@/views/search/AddApply.vue'),
        meta: {
            title: '添加申请',
            auth: true
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/search/Search.vue'),
        meta: {
            title: '查找好友',
            auth: true
        }
    },
    {
        path: '/roomNotice',
        name: 'RoomNotice',
        component: () => import('@/views/notice/RoomNotice.vue'),
        meta: {
            title: '群通知',
            auth: true
        }
    },
    {
        path: '/newBuddyNotice',
        name: 'NewBuddyNotice',
        component: () => import('@/views/notice/NewBuddyNotice.vue'),
        meta: {
            title: '新朋友',
            auth: true
        }
    },
    {
        path: '/createGroup',
        name: 'CreateGroup',
        component: () => import('@/views/group/CreateGroup.vue'),
        meta: {
            title: '创建群聊',
            auth: true
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/settings/Settings.vue'),
        meta: {
            title: '设置',
            auth: true
        }
    },
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
                    title: '对话',
                    auth:true
                }
            },
            {
                path: '/contact',
                name: 'Contact',
                component: () => import('@/views/home/Contact.vue'),
                meta: {
                    title: '联系人',
                    auth:true
                }
            },
            {
                path: '/me',
                name: 'Me',
                component: () => import('@/views/home/Me.vue'),
                meta: {
                    title: '我',
                    auth:true
                }
            },
        ]
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