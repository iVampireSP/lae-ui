const config = {
  dev: {
    api: 'http://www.lae.test/api/',
    auth: 'http://www.lae.test',

    ws_host: 'www.lae.test',
    ws_port: 6001,
    ws_auth_endpoint: 'http://www.lae.test/broadcasting/auth',

    avatar: 'https://cravatar.cn/avatar/',

    status: 'https://api.laecloud.com/ngx_status',
  },
  prod: {
    api: 'https://api.laecloud.com/api/',
    auth: 'https://api.laecloud.com',

    ws_host: 'socket.lae.yistars.net',
    ws_port: 443,
    ws_auth_endpoint: 'https://api.lae.yistars.net/broadcasting/auth',

    avatar: 'https://cravatar.cn/avatar/',

    status: 'https://api.laecloud.com/ngx_status',
  },
};

let current = config.dev;

if (process.env.NODE_ENV === 'production') {
  current = config.prod;
}

console.log('api endpoint: ' + current.api);

export default current;
