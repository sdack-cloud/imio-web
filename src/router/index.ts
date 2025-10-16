import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import routes from './routes'
import Cookies from 'js-cookie';

// 在应用启动时检查并重定向URL
if (typeof window !== 'undefined') {
    /*
    解决 Hash 第一次访问带参数 Hash模式 会改变成 localhost:5173/?a=123#/ 导致无法获取参数问题
     */
    const url = new URL(window.location.href)
    const hasQuery = url.search && url.search.length > 1
    const hasHash = url.hash && url.hash.length > 1

    // 如果有查询参数但没有hash，重定向到正确的hash格式
    if (hasQuery && !hasHash) {
        const queryString = url.search
        window.location.replace(`${url.origin}${url.pathname}#/${queryString}`)
    }
}

let router = createRouter({
    routes,
    history: createWebHashHistory()
});


/**
 * 路由拦截
 * 权限验证
 */

router.beforeEach(async (to, from, next) => {

    // 判断是否需要登录才可以进入
    console.log('=========== router =============')
    // 判断是否需要登录才可以进入
    if (to.matched.some(_ => _.meta.auth)) {
        // 这里依据 token 判断是否登录，可视情况修改
        const token = Cookies.get("token");
        if (token && token !== 'undefined') {
            next();
        } else {
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            });
        }
    } else {
        // 不需要身份校验 直接通过
        next();
    }
});

/*
router.afterEach(to => {
    if (Setting.showProgressBar) iView.LoadingBar.finish();
    // 多页控制 打开新的页面
    store.dispatch('admin/page/open', to);
    // 更改标题
    util.title({
        title: to.meta.title
    });
    // 返回页面顶端
    window.scrollTo(0, 0);
});
*/


export default router