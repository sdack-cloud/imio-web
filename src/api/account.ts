import request from '@/plugins/request';

export function AccountLogin (data: Record<string, any>) {
    return request({
        url: 'http://auth.sdack.cn:9000/oauth2/token',
        method: 'post',
        headers:{Authorization: 'Basic MTIxOjI0ZGVlM2RlYjc3NDQ4ZGNiZTliZTk1Mzc3NGFiYWJl','Content-Type':'application/x-www-form-urlencoded'},
        data: {...data, 'grant_type':"urn:ietf:params:oauth:grant-type:password",scope:'openid,userinfo'}
    });
}

export function logout (token:string,type:number = 1) {
    return request({
        url: 'http://auth.sdack.cn:9000/oauth2/revoke',
        method: 'post',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data: {token:token,'token_type_hint':type == 1?'token':'refresh_token'}
    });
}

export function AccountRegister (data: Record<string, any>) {
    return request({
        url: 'http://auth.sdack.cn:9000/register/account',
        method: 'post',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data
    });
}
