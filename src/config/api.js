const config = {
    dev: {
        api: 'http://www.lae.test/api/',
        auth: 'http://www.lae.test',

        ws_gateway: 'ws://127.0.0.1:8282',

        ws_host: 'www.lae.test',
        ws_port: 6001,
        ws_auth_endpoint: 'http://www.lae.test/broadcasting/auth',

        avatar: 'https://cravatar.cn/avatar/',

        status: 'https://api.laecloud.com/ngx_status',

        modules: {
            gct: {
                panel: 'http://192.168.81.107'

            }
        }
    },
    prod: {
        api: 'https://api.laecloud.com/api/',
        auth: 'https://api.laecloud.com',

        ws_gateway: 'wss://ws.gateway.laecloud.com',

        ws_host: 'socket.lae.yistars.net',
        ws_port: 443,
        ws_auth_endpoint: 'https://api.lae.yistars.net/broadcasting/auth',

        avatar: 'https://cravatar.cn/avatar/',

        status: 'https://api.laecloud.com/ngx_status',

        modules: {
            gct: {
                panel: 'https://ptero.laecloud.com'
            }
        }
    },
}

let current = config.dev;

if (process.env.NODE_ENV === 'production') {
    current = config.prod;
}

console.log('api endpoint: ' + current.api);

export default current;