const config = {
  dev: {
    api: 'http://www.lae.test/api/',
    auth: 'http://www.lae.test',
    ws_host: 'www.lae.test',
    ws_port: 6001,
    ws_auth_endpoint: 'http://www.lae.test/api/broadcasting/auth',
  },
  prod: {
    api: 'https://api.lae.yistars.net/api/',
    auth: 'https://www.laecloud.com',

    ws_host: 'socket.lae.yistars.net',
    ws_port: 443,
    ws_auth_endpoint: 'https://api.lae.yistars.net/api/broadcasting/auth',
  },
};

let current = config.dev;

if (process.env.NODE_ENV === 'production') {
  current = config.prod;
}

console.log('api endpoint: ' + current.api);

export default current;
